import MockApConfluence from '../../src/utils/MockApConfluence'
import Macro from '../../src/utils/Macro'

describe('Macro only comment related functions', () => {
  test('propertyKey should include graph', async () => {
    const mockApConfluence = new MockApConfluence();
    const graphMacro = new Macro(mockApConfluence, 'graph');
    const graph = await graphMacro.load();
    expect(graph.graphXml).toBe(graphMacro.EXAMPLE_GRAPHXML);
    expect(graphMacro.propertyKey('uuid_1')).toBe('zenuml-graph-macro-uuid_1-body');
  })
})