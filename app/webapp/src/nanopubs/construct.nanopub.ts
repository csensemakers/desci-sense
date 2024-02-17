import { Nanopub } from '@nanopub/sign';

import { THIS_POST_NAME } from '../app/config';
import { parseRDF, replaceNodes, writeRDF } from '../shared/n3.utils';
import { AppPostSemantics } from '../shared/parser.types';

export const constructNanopub = async (
  content: string,
  semantics: AppPostSemantics,
  orcid: string
): Promise<Nanopub> => {
  const NANOPUB_PLACEHOLDER = 'http://purl.org/nanopub/temp/mynanopub#';
  const store = await parseRDF(semantics);
  const assertionsStore = replaceNodes(store, {
    [THIS_POST_NAME]: `${NANOPUB_PLACEHOLDER}assertion`,
  });
  const assertionsRdf = await writeRDF(assertionsStore);

  const rdfStr = `
    @prefix : <${NANOPUB_PLACEHOLDER}> .
    @prefix np: <http://www.nanopub.org/nschema#> .
    @prefix dct: <http://purl.org/dc/terms/> .
    @prefix nt: <https://w3id.org/np/o/ntemplate/> .
    @prefix npx: <http://purl.org/nanopub/x/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix orcid: <https://orcid.org/> .
    @prefix ns1: <http://purl.org/np/> .
    @prefix prov: <http://www.w3.org/ns/prov#> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    
    :Head {
      : np:hasAssertion :assertion ;
        np:hasProvenance :provenance ;
        np:hasPublicationInfo :pubinfo ;
        a np:Nanopublication .
    }
    
    :assertion {
      :assertion dct:creator orcid:0009-0004-1787-0341 .
      ${assertionsRdf}
    }
    
    :provenance {
      :assertion prov:wasAttributedTo orcid:0009-0004-1787-0341 .
    }
    
    :pubinfo {
      
    }
  `;

  const np = new Nanopub(rdfStr);
  return np;
};
