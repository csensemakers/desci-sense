import { Nanopub } from '@nanopub/sign';

import { parseRDF, replaceBlankNodes, writeRDF } from '../shared/n3.utils';
import { AppPostSemantics } from '../shared/parser.types';

export const constructNanopub = async (
  content: string,
  semantics: AppPostSemantics,
  orcid: string
): Promise<Nanopub> => {
  const store = await parseRDF(semantics);
  const assertionsStore = replaceBlankNodes(store, { '_:1': ':assertion' });
  const assertionsRdf = await writeRDF(assertionsStore);

  const rdfStr = `
    @prefix : <http://purl.org/nanopub/temp/mynanopub#> .
    @Prefix np: http://www.nanopub.org/nschema# .
    @Prefix dct: http://purl.org/dc/terms/ .
    @Prefix nt: https://w3id.org/np/o/ntemplate/ .
    @Prefix npx: http://purl.org/nanopub/x/ .
    @Prefix xsd: http://www.w3.org/2001/XMLSchema# .
    @Prefix rdfs: http://www.w3.org/2000/01/rdf-schema# .
    @Prefix orcid: https://orcid.org/ .
    @Prefix ns1: http://purl.org/np/ .
    @Prefix prov: http://www.w3.org/ns/prov# .
    @Prefix foaf: http://xmlns.com/foaf/0.1/ .

    :Head {
      : np:hasAssertion :assertion ;
        np:hasProvenance :provenance ;
        np:hasPublicationInfo :pubinfo ;
        a np:Nanopublication .
    }

    :assertion {
      :assertion dct:creator orcid:${orcid} ;
      ${assertionsRdf}
    }

    :provenance {
      :assertion prov:wasAttributedTo orcid:${orcid} .
    }

    :pubinfo {
      
    }
  `;

  const np = new Nanopub(rdfStr);
  return np;
};
