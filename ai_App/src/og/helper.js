export function checkHeading(str) {
    return /^(\*)(\*)(.*)(\*)(\*)$/.test(str.trim())

/*

^  **  Hello World  **  $
│   │       │        │  │
│   │       │        │  End
│   │       │        Last two *
│   │    Anything
│ First two *
Start

*/
}

export function replaceHeadingStar(str) {
    return str.trim().replace(/^(\*)(\*)(.*)(\*)(\*)$/,"$3")

/*
    ^  **  Hello World  **  $
    │   │       │        │  │
    │   │       │        │  End
    │   │       │        Last two *
    │   │    Anything
    │ First two *
    Start

    is replaced by ($3) ("Anything")

*/
}
export function checkLabel(str) {
    return /^(Field|Contribution|Answer|Explanation|Conclusion|Note|Example|Examples|Summary|Key Points):$/i.test(str.trim())

/*
    ^  Field | Contribution | Answer | Explanation | Conclusion | Note | Example | Examples | Summary | Key Points  :  $
    │                                      │                                                   │              │
    │                                      │                                                   │              End
    │                                      │                                                   Colon :
    │                                      Any one of the given labels
    │                                      │
    │                                      │
    │                                      Start

    checks whether the string is exactly one of the given labels followed by (:)
    i = case insensitive
    trim() = removes extra spaces from beginning and end
*/
}