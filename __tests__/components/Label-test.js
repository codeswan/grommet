// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React from 'react';
import renderer from 'react/lib/ReactTestRenderer';

import Label from '../../src/js/components/Label';

describe('Label', () => {
  it('has correct default options', () => {
    const component = renderer.create(
      <Label>Testing</Label>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has correct uppercase=true rendering', () => {
    const component = renderer.create(
      <Label uppercase={true}>Testing</Label>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has correct size="small" and margin="large" rendering', () => {
    const component = renderer.create(
      <Label size="small" margin="large">Testing</Label>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
