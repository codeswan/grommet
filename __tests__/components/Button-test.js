// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React from 'react';
import renderer from 'react/lib/ReactTestRenderer';

import Button from '../../src/js/components/Button';

import FakeIcon from '../mocks/FakeIcon';

describe('Button', () => {
  it('has correct default options', () => {
    const component = renderer.create(
      <Button label='Test me' />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has correct primary={true} rendering', () => {
    const component = renderer.create(
      <Button label='Test me' primary={true} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has correct plain={true} rendering', () => {
    const component = renderer.create(
      <Button label='Test me' plain={true} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has correct icon rendering', () => {
    const component = renderer.create(
      <Button icon={<FakeIcon />} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has correct icon as children rendering', () => {
    const component = renderer.create(
      <Button><FakeIcon /></Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has text as children rendering', () => {
    const component = renderer.create(
      <Button>test</Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
