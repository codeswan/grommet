// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React from 'react';
import renderer from 'react/lib/ReactTestRenderer';

import App from '../../src/js/components/App';

// needed because this:
// https://github.com/facebook/jest/issues/1353
jest.mock('react-dom');

describe('App', () => {
  it('has correct default options', () => {
    const component = renderer.create(
      <App><h2>App Body</h2></App>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has correct inline=true rendering', () => {
    const component = renderer.create(
      <App inline={true} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has correct className rendering', () => {
    const component = renderer.create(
      <App className='testing' />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
