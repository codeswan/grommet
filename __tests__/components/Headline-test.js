// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React from 'react';
import renderer from 'react/lib/ReactTestRenderer';

import Headline from '../../src/js/components/Headline';

describe('Headline', () => {
  it('has correct default options', () => {
    const component = renderer.create(
      <Headline>Testing</Headline>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
