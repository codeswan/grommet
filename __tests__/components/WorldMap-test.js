// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React from 'react';
import renderer from 'react/lib/ReactTestRenderer';

import WorldMap from '../../src/js/components/WorldMap';

describe('WorldMap', () => {
  it('has correct default options', () => {
    const component = renderer.create(
      <WorldMap series={[{continent: 'Australia'}]} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
