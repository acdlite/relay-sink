import PropTypes from 'prop-types';
import { Component } from 'react';
import Relay from 'react-relay';
import pick from 'lodash/object/pick';
import shallowEqual from './shallowEqual';

export function createSink(config) {
  const fragmentKeys = Object.keys(config.fragments);

  class RelaySink extends Component {
    static propTypes = {
      onFragmentUpdate: PropTypes.func
    };

    fragments = pick(this.props, fragmentKeys);

    componentWillMount() {
      this.props.onFragmentUpdate(this.fragments);
    }

    componentWillReceiveProps(nextProps) {
      const nextFragments = pick(nextProps, fragmentKeys);
      if (!shallowEqual(this.fragments, nextFragments)) {
        this.fragments = nextFragments;
        this.props.onFragmentUpdate(this.fragments);
      }
    }

    render() {
      return null;
    }
  }

  return Relay.createContainer(RelaySink, config);
}
