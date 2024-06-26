import type { IMark } from './mark';

export type FormattedText<TMarks extends IMark = IMark> =
  FormattedTextItem<TMarks>[];

export type FormattedTextItem<TMark extends IMark = IMark> = {
  text: string | FormattedText<TMark>;
  marks?: TMark[];
};

export type TextInput<TMark extends IMark = IMark> =
  | string
  | FormattedTextItem<TMark>
  | FormattedText<TMark>;
