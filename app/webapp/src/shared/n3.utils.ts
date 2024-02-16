import { DataFactory, OTerm, Parser, Quad, Store, Writer } from 'n3';

export const parseRDF = (text: string) => {
  const parser = new Parser();
  const store = new Store();

  parser.parse(text, (error, quad, prefixes) => {
    if (quad) {
      store.addQuad(quad);
    } else if (error) {
      console.error(error);
    } else {
      console.log('Parsing finished. Found prefixes:', prefixes);
      // Here you can query or manipulate the RDF data
    }
  });
  return store;
};

export const writeRDF = async (store: Store): Promise<string | undefined> => {
  const writer = new Writer({ format: 'Turtle' });
  store.forEach((quad) => writer.addQuad(quad), null, null, null, null);

  return new Promise((resolve, reject) => {
    writer.end((error, result?: string) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

export const mapStore = (
  store: Store,
  callback: (q: Quad) => Quad,
  subject: OTerm = null,
  predicate: OTerm = null,
  object: OTerm = null,
  graph: OTerm = null
) => {
  const newStore = new Store();

  store.forEach(
    (quad) => {
      const newQuad = callback(quad);
      newStore.addQuad(newQuad);
    },
    subject,
    predicate,
    object,
    graph
  );

  return newStore;
};

export const mapStoreElements = <T>(
  store: Store,
  callback: (q: Quad) => T,
  subject: OTerm = null,
  predicate: OTerm = null,
  object: OTerm = null,
  graph: OTerm = null
) => {
  const output: T[] = [];

  store.forEach(
    (quad) => {
      output.push(callback(quad));
    },
    subject,
    predicate,
    object,
    graph
  );

  return output;
};

export const filterStore = (
  store: Store,
  callback: (q: Quad) => boolean,
  subject: OTerm = null,
  predicate: OTerm = null,
  object: OTerm = null,
  graph: OTerm = null
) => {
  const newStore = new Store();

  store.forEach(
    (quad) => {
      if (callback(quad)) {
        newStore.addQuad(quad);
      }
    },
    subject,
    predicate,
    object,
    graph
  );

  return newStore;
};

export const forEachStore = (
  store: Store,
  callback: (q: Quad) => void,
  subject: OTerm = null,
  predicate: OTerm = null,
  object: OTerm = null,
  graph: OTerm = null
) => {
  return store.forEach(callback, subject, predicate, object, graph);
};

export const replaceBlankNodes = (
  store: Store,
  blankNodeMap: Record<string, string>
) => {
  const newStore = mapStore(store, (quad) => {
    let { subject, predicate, object, graph } = quad;

    if (subject.termType === 'BlankNode') {
      if (!blankNodeMap[subject.value]) {
        throw new Error(`Undefined value for blank node ${subject.value}`);
      }
      subject = DataFactory.namedNode(blankNodeMap[subject.value]);
    }

    // Replace object if it is a blank node
    if (object.termType === 'BlankNode') {
      if (!blankNodeMap[object.value]) {
        throw new Error(`Undefined value for blank node ${subject.value}`);
      }
      object = DataFactory.namedNode(blankNodeMap[object.value]);
    }

    return DataFactory.quad(subject, predicate, object, graph);
  });

  return newStore;
};
