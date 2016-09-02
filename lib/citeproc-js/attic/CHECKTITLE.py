#!/usr/bin/python

import sys,os,re

filenames = [
    "bugreports_AuthorPosition.txt",
    "bugreports_ByBy.txt",
    "bugreports_ikeyOne.txt",
    "bugreports_TitleCase.txt",
    "bugreports_UndefinedNotString.txt",
    "bugreports_UndefinedStr.txt",
    "bugreports_UriWrapping.txt",
    "disambiguate_ByCiteIsDefault.txt",
    "flipflop_Apostrophes.txt",
    "label_PluralNumberOfVolumes.txt",
    "locale_TitleCaseEmptyLangEmptyLocale.txt",
    "locale_TitleCaseEmptyLangNonEnglishLocale.txt",
    "locale_TitleCaseEnglishLangUpperEmptyLocale.txt",
    "locale_TitleCaseGarbageLangEmptyLocale.txt",
    "locale_TitleCaseGarbageLangEnglishLocale.txt",
    "locale_TitleCaseGarbageLangNonEnglishLocale.txt",
    "locale_TitleCaseNonEnglishLangUpperEmptyLocale.txt",
    "number_NewOrdinalsEdition.txt",
    "punctuation_DefaultYearSuffixDelimiter.txt",
    "textcase_CapitalsUntouched.txt",
    "textcase_NonEnglishChars.txt",
    "textcase_SkipNameParticlesInTitleCase.txt",
    "textcase_TitleCapitalization.txt",
    "textcase_TitleCaseNonEnglish2.txt",
    "textcase_TitleCaseNonEnglish.txt",
    "textcase_TitleCaseWithHyphens.txt",
    "textcase_TitleCaseWithInitials.txt"
]

for filename in filenames:
    print "FIXTURE: %s" % filename
    txt = open(filename).read()
    m = re.match('.*>>==* RESULT ==*>>(.*)<<==* RESULT ==*<<.*', txt, re.S|re.M)
    if m:
        print m.group(1)
