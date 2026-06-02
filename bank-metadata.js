(function () {
  "use strict";

  const questions = window.CCNA_QUESTIONS || [];
  const englishSourcesByCurrentId = {
    3: [146], 35: [170], 54: [138], 59: [117, 174], 61: [143],
    64: [130], 68: [131], 87: [149], 99: [133], 100: [77, 145],
    103: [152], 117: [157], 118: [151], 119: [39, 148],
    124: [48, 155], 128: [142], 129: [164], 131: [153],
    146: [132], 147: [134], 148: [135], 149: [136], 150: [139],
    151: [140], 152: [141], 153: [144], 154: [147], 155: [150],
    156: [154], 157: [156], 158: [158], 159: [159], 160: [160],
    161: [161], 162: [162], 163: [163], 164: [165], 165: [166],
    166: [167], 167: [168], 168: [169], 169: [171], 170: [172],
    171: [173]
  };

  function normalizeText(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u2019\u2018]/g, "'")
      .replace(/[\u201c\u201d\u00ab\u00bb]/g, '"')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  questions.forEach((question) => {
    const sourceEnNumbers = englishSourcesByCurrentId[question.id] || [];
    question.stableId = question.stableId || `srwe-q-${String(question.id).padStart(4, "0")}`;
    question.sourceFrNumber = question.sourceFrNumber ?? question.sourceNumber ?? null;
    question.sourceEnNumbers = question.sourceEnNumbers || sourceEnNumbers.slice();
    question.sourceEnNumber = question.sourceEnNumber ?? question.sourceEnNumbers[0] ?? null;
    question.normalizedText = question.normalizedText || normalizeText(question.question);
  });

  window.CCNA_BANK_META = {
    schemaVersion: 1,
    normalizationVersion: 1,
    stableIdStrategy: "preserved-current-numeric-id",
    frenchQuestionCount: questions.length,
    englishRawBlockCount: 172,
    englishExactUniqueQuestionCount: 168,
    importedValidatedQuestionCount: 0,
    validatedAdditionalQuestions: [],
    englishExactDuplicates: [
      { sourceEnNumbers: [39, 148], sourceFrCurrentId: 119 },
      { sourceEnNumbers: [48, 155], sourceFrCurrentId: 124 },
      { sourceEnNumbers: [77, 145], sourceFrCurrentId: 100 },
      { sourceEnNumbers: [117, 174], sourceFrCurrentId: 59 }
    ],
    note: "Aucune question anglaise reellement supplementaire n'a ete validee. Les identifiants numeriques actuels sont conserves pour la compatibilite locale."
  };
})();
