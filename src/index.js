import { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import pick from 'lodash/object/pick';
import shallowEqual from './shallowEqual';

export function createSink(config) {
  const fragmentKeys = Object.keys(config.fragments);

  class RelaySink extends Component {
    constructor(props) {
      super(props);
      this.fragments = pick(props, fragmentKeys);
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

  RelaySink.propTypes = {
    onFragmentUpdate: PropTypes.func
  };

  return Relay.createContainer(RelaySink, config);
}
