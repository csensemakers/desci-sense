import { Nanopub } from '@nanopub/sign';
import { AppPostCreate, AppUserRead } from '../@shared/types';

export const constructNanopub = (postCreateData: AppPostCreate, user: AppUserRead): Promise<Nanopub> => {
  const rdfStr = `@prefix this: <http://purl.org/np/RAHtkscyyyJDLvWRuINckQrn5rbHzQKvwakNVC3fmRzGX> .
  @prefix sub: <http://purl.org/np/RAHtkscyyyJDLvWRuINckQrn5rbHzQKvwakNVC3fmRzGX#> .
  @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
  @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
  @prefix np: <http://www.nanopub.org/nschema#> .
  @prefix npx: <http://purl.org/nanopub/x/> .
  @prefix orcid: <https://orcid.org/> .
  @prefix prov: <http://www.w3.org/ns/prov#> .
  sub:Head {
    this: np:hasAssertion sub:assertion ;
      np:hasProvenance sub:provenance ;
      np:hasPublicationInfo sub:pubinfo ;
      a np:Nanopublication .
  }
  sub:assertion {
    <http://identifiers.org/umls/C0355800> rdfs:label "Naltrexone hydrochloride" .
  }
  sub:provenance {
    sub:assertion prov:generatedAtTime "2023-02-21T11:15:07.732162"^^xsd:dateTime ;
      prov:wasAttributedTo orcid:0000-0002-1501-1082 .
  }
  `
  
  return Nanopub(rdfStr);
}