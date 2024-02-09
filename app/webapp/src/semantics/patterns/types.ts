import { ParserResult } from '../../shared/types';

export type Pattern = (parsed: ParserResult) => JSX.Element;
