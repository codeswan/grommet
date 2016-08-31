// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React from 'react';
import renderer from 'react/lib/ReactTestRenderer';

import Markdown from '../../src/js/components/Markdown';

describe('Markdown', () => {
  it('has correct default options', () => {
    const component = renderer.create(
      <Markdown content='test'
        components={{
          p: { props: { className: 'testing', size: 'large' } }
        }} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
