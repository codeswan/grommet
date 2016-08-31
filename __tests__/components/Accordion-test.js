// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React from 'react';
import renderer from 'react/lib/ReactTestRenderer';

import Accordion from '../../src/js/components/Accordion';
import AccordionPanel from '../../src/js/components/AccordionPanel';

import { findAllByType } from '../utils/renderer-finder';

// needed because this:
// https://github.com/facebook/jest/issues/1353
jest.mock('react-dom');

describe('Accordion', () => {
  it('has correct default options', () => {
    const component = renderer.create(
      <Accordion>
        <AccordionPanel heading="First Title">
          <p>test</p>
        </AccordionPanel>
      </Accordion>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has correct openMulti=true rendering', () => {
    const component = renderer.create(
      <Accordion openMulti>
        <AccordionPanel active heading="First Title">
          <p>test 1</p>
        </AccordionPanel>
        <AccordionPanel active heading="Second Title">
          <p>test 2</p>
        </AccordionPanel>
      </Accordion>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('has correct initialIndex=0 rendering', () => {
    const component = renderer.create(
      <Accordion initialIndex={0}>
        <AccordionPanel active heading="First Title">
          <p>test 1</p>
        </AccordionPanel>
        <AccordionPanel active heading="Second Title">
          <p>test 2</p>
        </AccordionPanel>
      </Accordion>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // activating the second panel
    const panelHeaders = findAllByType(tree, 'header');
    panelHeaders[1].props.onClick();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
