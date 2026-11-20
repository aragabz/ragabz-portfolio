// @ts-check
// Shiki theme for the dark code card. Four syntax colours only, matching the design tokens
// in src/styles/global.css (--color-code-*); everything else is the card's foreground.

const FG = '#EDEDEA';
const KEYWORD = '#FF9E64';
const STRING = '#C8F169';
const TYPE = '#7DCFFF';
const COMMENT = '#8B8B85';

/** @type {import('shiki').ThemeRegistrationRaw} */
export default {
  name: 'ragabz-dark',
  type: 'dark',
  colors: {
    'editor.background': '#121212',
    'editor.foreground': FG,
  },
  settings: [
    { settings: { foreground: FG, background: '#121212' } },
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: COMMENT, fontStyle: 'italic' },
    },
    {
      scope: [
        'keyword',
        'storage',
        'storage.type',
        'storage.modifier',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'constant.language',
        'constant.numeric',
        'variable.language',
        'entity.name.tag',
        'punctuation.definition.annotation',
        'storage.type.annotation',
        'meta.annotation',
        'markup.heading',
      ],
      settings: { foreground: KEYWORD },
    },
    {
      scope: [
        'string',
        'string.quoted',
        'string.template',
        'punctuation.definition.string',
        'constant.character',
        'markup.inline.raw',
        'markup.inserted',
      ],
      settings: { foreground: STRING },
    },
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'entity.name.namespace',
        'entity.other.inherited-class',
        'support.type',
        'support.class',
        'storage.type.primitive',
        'storage.type.built-in',
        'storage.type.java',
        'storage.type.generic',
        'entity.other.attribute-name',
        'support.type.property-name',
        'meta.type.annotation',
      ],
      settings: { foreground: TYPE },
    },
    {
      scope: ['keyword.operator', 'punctuation', 'meta.brace', 'variable', 'entity.name.function', 'support.function'],
      settings: { foreground: FG },
    },
    { scope: ['markup.deleted'], settings: { foreground: KEYWORD } },
    { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
    { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
  ],
};
