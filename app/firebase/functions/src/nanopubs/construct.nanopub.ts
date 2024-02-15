import { Nanopub } from '@nanopub/sign';

import { AppPostCreate, AppUserRead } from '../@shared/types';

export const constructNanopub = async (
  postCreateData: AppPostCreate,
  user: AppUserRead
): Promise<Nanopub> => {
  const rdfStr = `
    @prefix : <http://purl.org/nanopub/temp/mynanopub#> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    @prefix dc: <http://purl.org/dc/terms/> .
    @prefix pav: <http://purl.org/pav/> .
    @prefix prov: <http://www.w3.org/ns/prov#> .
    @prefix np: <http://www.nanopub.org/nschema#> .
    @prefix npx: <http://purl.org/nanopub/x/> .
    @prefix ex: <http://example.org/> .
    
    :Head {
      : np:hasAssertion :assertion ;
        np:hasProvenance :provenance ;
        np:hasPublicationInfo :pubinfo ;
        a np:Nanopublication .
    }
    
    :assertion {
      ex:mosquito ex:transmits ex:malaria .
    }
    
    :provenance {
      :assertion prov:hadPrimarySource <http://dx.doi.org/10.3233/ISU-2010-0613> .
    }
    
    :pubinfo {
      : a npx:ExampleNanopub .
    }
  `;

  const np = new Nanopub(rdfStr);
  return np;
};
