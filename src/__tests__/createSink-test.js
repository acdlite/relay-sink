import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { graphql } from 'graphql';
import Relay from 'react-relay';
import { expect } from 'chai';
import { createSink } from 'relay-sink';
import schema from '../../data/schema.js';

const { renderIntoDocument } = TestUtils;

const networkLayer = {
  sendMutation: mutationRequest => (
    graphql(schema, mutationRequest.getQueryString()).then(result => {
      if (result.errors) {
        mutationRequest.reject(new Error());
      } else {
        mutationRequest.resolve({ response: result.data });
      }
    })
  ),
  sendQueries: queryRequests => (
    Promise.all(queryRequests.map(
      queryRequest => graphql(schema, queryRequest.getQueryString())
        .then(result => {
          if (result.errors) {
            queryRequest.reject(new Error());
          } else {
            queryRequest.resolve({ response: result.data });
          }
        })
    ))
  ),
  supports: () => false
};

Relay.injectNetworkLayer(networkLayer);

const delay = ms => new Promise(res => setTimeout(res, ms));

describe('createSink()', () => {
  it('works', async () => {
    let relationships = null;

    const RelationshipSink = createSink({
      fragments: {
        character: () => Relay.QL`
          fragment on Character {
            relationships {
              character {
                name
              }
            }
          }
        `
      }
    });

    const Character = Relay.createContainer(
      ({ character }) => (
        <RelationshipSink
          character={character}
          onFragmentUpdate={fragments => {
            relationships = fragments.character.relationships
              .map(r => r.character.name);
          }}
        />
      ),
      {
        fragments: {
          character: () => Relay.QL`
            fragment on Character {
              name,
              house,
              ${RelationshipSink.getFragment('character')}
            }
          `
        }
      }
    );

    class Root extends React.Component {
      state = { characterName: 'Tyrion' }

      render() {
        return (
          <Relay.RootContainer
            Component={Character}
            route={{
              name: 'CharacterRoute',
              queries: {
                character: Component => Relay.QL`
                  query {
                    character(name: $name) {
                      ${Component.getFragment('character')}
                    }
                  }
                `
              },
              params: {
                name: this.state.characterName,
              }
            }}
          />
        );
      }
    }

    const tree = renderIntoDocument(<Root />);
    await delay(0);

    expect(relationships).to.eql([
      'Cersei',
      'Tywin',
      'Jaime'
    ]);

    tree.setState({ characterName: 'Cersei' });
    await delay(0);

    expect(relationships).to.eql([
      'Tyrion',
      'Tywin',
      'Jaime'
    ]);
  });
});
