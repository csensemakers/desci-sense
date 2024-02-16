import { DataFactory, OTerm, Parser, Quad, Store, Writer } from 'n3';

export const parseRDF = (text: string): Promise<Store> => {
  return new Promise((resolve, reject) => {
    const parser = new Parser();
    const store = new Store();

    parser.parse(text, (error, quad, prefixes) => {
      if (quad) {
        store.addQuad(quad);
      } else if (error) {
        console.error(error);
      } else {
        resolve(store);
      }
    });
  });
};

export const writeRDF = async (store: Store): Promise<string | undefined> => {
  const writer = new Writer({ format: 'N-Triples' });
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

export const replaceNamedNodes = (
  store: Store,
  namedNodeMap: Record<string, string>
) => {
  const newStore = mapStore(store, (quad) => {
    let { subject, predicate, object, graph } = quad;

    if (subject.termType === 'NamedNode') {
      if (!namedNodeMap[subject.value]) {
        throw new Error(`Undefined value for blank node ${subject.value}`);
      }
      subject = DataFactory.namedNode(namedNodeMap[subject.value]);
    }

    if (object.termType === 'NamedNode') {
      if (!namedNodeMap[object.value]) {
        throw new Error(`Undefined value for blank node ${subject.value}`);
      }
      object = DataFactory.namedNode(namedNodeMap[object.value]);
    }

    return DataFactory.quad(subject, predicate, object, graph);
  });

  return newStore;
};
