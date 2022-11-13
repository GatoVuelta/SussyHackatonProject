# <center><img src="https://cdn.discordapp.com/icons/923915766674366474/0776b26799547884a647b65d4560f008.png?size=32" style="margin-bottom: -23px"></img>[Documatic](https://www.documatic.com/) Hackathon project submission</center>

Documatic is a search engine for your codebase; Ask documatic a question and find relevant code snippets and insights in seconds.

https://www.documatic.com/
Documatic acts as a search engine for your codebase; once you describe what you're looking for, Documatic pulls up related code or documentation making it easier to find what you're looking for in seconds!

Not sitting next to each other? No problem. Ask Documatic questions of your codebase to learn and understand your code in seconds. Documatic is the team member you wish you had

Our Visual studio Code extension: https://marketplace.visualstudio.com/items?itemName=Documatic.documatic

<img src="https://cdn.discordapp.com/attachments/926110059782615071/1037404343470661713/Documatic_sh6hrz.gif" style="margin-bottom: 25px"></img>

# Advanced Relative Calendar - A luxon utility
#### aka SussyHackatonProject

This is a small utility that allows you to get a relative date from a given date, in a more customizable and rich way. It was built on the [Luxon](https://moment.github.io/luxon/) DateTime library.

#### Turn this:
```js
date.plus({ days: 8 }).toRelativeCalendar()
// => "in 1 week"
```

#### Into this:
```js
date.plus({ days: 8 }).toRelativeCalendarAdvanced("{{[rpf]wd}} {{[at] h m}}")
// => "the next monday at 15:32"
```

#### Or even this:
```js
date.plus({ days: 8 }).toRelativeCalendarAdvanced("The party will be {{[rpf]wd}} at {{h|f:1}} {{ampm}}, will you be coming?")
// -> "The party will be next monday at 3 PM, will you be coming?"
```

#### ...in no time!

## Table of contents
- [Installation *](#installation)
- [Features](#features)
- [Syntax](#syntax)
  - [Parameters](#parameters)
  - [Format string](#format-string)
    - [Tokens](#tokens)
      - [Prefixes](#prefixes)
      - [Values](#values)
      - [Filters](#filters)
      - [Special tokens](#special-tokens)
- [Examples](#examples)
- [License](#license)
- [Inspiration](#inspiration)
- [Acknowledgments](#acknowledgments)

## Installation *
```bash
npm i luxon-advanced-relative-calendar
```

## Features
- Easy customization of simple or ultra complex relative dates
- Easy to learn syntax
- Numeric filters to format numeric values
- Smart H:M:S combo formatting
- Support for **English** and **Spanish** locales (carefully crafted by hand 😉)

## Syntax
```js
luxon.DateTime.toRelativeCalendarAdvanced(format, [locale])
```

### Parameters
- `format` - The format string. See below for more info.
- `locale` - The locale to use. Currently, there is support for English `en` and Spanish `es`. Defaults to `en`.

### Format string
The format string is a string that contains the desired output. It is composed of **tokens** and **text**. Tokens are enclosed in double curly braces `{{}}` and text is everything else. Tokens are replaced by their corresponding value, and text is left as is.
**General format:** `{{[prefix]value|filter:filterArg}}`

#### Tokens
Tokens are composed of 3 parts: **prefix**, **value** and **filters**. The prefix and the filter are optional, see below for  a list of available prefixes and filters.

##### Prefixes
- ***`[at]`*** - Adds the appropiate article/preposition to the value to express relativity. For example, `{{[at]h}} {{ampm}}` will return `at 3 PM`, and `{{[at]wd}}` will return `on monday`.
- ***`[rpf]`*** - Acts the same as the `[at]` prefix, but it will return the relative past/future form of the value taking in account calendar days. For example, `{{[rpf]wd}}` would return `yesterday`, `today`, `tomorrow` or `next monday` depending on the date given.

##### Values
- ***`wd`*** - The weekday name. For example, `{{wd}}` will return `monday`.
- ***`h`*** - The hour. For example, `{{h}}` will return `15`.
- ***`m`*** - The minute. For example, `{{m}}` will return `32`.
- ***`s`*** - The second. For example, `{{s}}` will return `12`.

##### Filters
- ***`|f:`*** - ***fill*** - This filters outputs a value with a desired amount of digits by adding zeroes. For example, for a time where the hour is `3`, `{{h|f:1}}` will return `3`, and `{{h|f:2}}` will return `03`.

##### Special tokens
- ***`{{ampm}}`*** - This token will return `AM` or `PM` depending on the hour given. For example, `{{h m}} {{ampm}}` will return `3:32 PM`.

## Examples
```js
DateTime.local().toRelativeCalendarAdvanced("{{[rpf]wd}} {{[at] h m}}")
// => "today at 15:32"
```

```js
DateTime.local().minus({ days: 3 }).toRelativeCalendarAdvanced("Message sent {{[rpf]wd}}")
// => "Message sent this monday"
```

```js
DateTime.local().plus({ days: 8 }).toRelativeCalendarAdvanced("{{[rpf]wd}} at {{m}} minutes and {{s|f:10}} seconds after {{h|f:2}} {{ampm}}")
// => "next monday at 32 minutes and 12 seconds after 03 PM"
```

```js
DateTime.local().plus({ days: 8 }).toRelativeCalendarAdvanced("El estreno será {{[rpf]wd}} {{[at]h|f:2}}:{{m|f:2}} {{ampm}}", "es")
// => "El estreno será el próximo lunes a las 03:32 PM"
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Inspiration
- *[This Stackoverflow comment](https://stackoverflow.com/questions/53713772/displaying-time-relative-to-a-given-using-luxon-library#:~:text=Is%20there%20a%20way%20to%20customize)* p.d: RIP Mr. Alexei S. 3 years have passed 😂.
- I use luxon a lot, and I wanted to make it more customizable, specially for my language (Spanish).

## Acknowledgments
- [Luxon](https://moment.github.io/luxon/) for being such a great library.
- [Documatic](https://www.documatic.com/) for hosting this hackathon.

`*` This package is not yet published on npm, but it will be soon, hopefully


