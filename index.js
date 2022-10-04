const {DateTime} = require('luxon');

/**
 * @author Andrés
 * @date 2022-10-04
 * @param {string} format - The format to use in the special DateTime expression format
 * @returns {any}
 */
DateTime.prototype.toRelativeCalendarAdvanced = function toRelativeCalendarAdvanced(format = '{{[at]wd}}', lang = 'en') {
  //First, get the parts of the string that are inside double curly brackets
  var formatObject = []
  var parts = format.match(/{{(.*?)}}/g);
  //Then, for each part, add a new key to the format object, with a generated id
  parts.forEach((part, index) => {
    const _raw = part;
    //get the filters, if present, on each part, for example, in "{{h|0}}", the filter is "0"
    //for this, make a regex to catch text between "|" and "}}"
    var _filter = part.match(/\|(.*?)\}\}/)
    _filter = _filter ? _filter[1] : null

    //in case filter is "f:0", means the filter "fill" with 0, so check with regex for "f:"
    var filter_fill;
    if (_filter && _filter.match(/f:/)) {
      filter_fill = _filter.match(/f:(.*)/)[1]
      _filter = _filter.replace(/f:(.*)/, '')
    } else {
      filter_fill = null
    }

    //remove the filter syntax and content from the part
    part = part.replace(/\|(.*?)\}\}/, '}}')

    var _relativeNoun = part.match(/\[(.*?)\]/)
    var _relativeNoun = _relativeNoun ? _relativeNoun[1] : null

    //text that is outside the [] but inside the {{}}, for example, in {{[at]wd}}, it would be "wd"
    // If relative noun is not null, try with text between ] and }}, else just take the whole text between {{ and }}
    var _timecomponents = []
    if (_relativeNoun) {
      _timecomponents = part.match(/\](.*?)}}/)
    } else {
      _timecomponents = part.match(/{{(.*?)}}/)
    }
    _timecomponents = _timecomponents ? _timecomponents[1].split(' ') : []
    formatObject.push({
      id: index,
      format: {
        raw: _raw,
        relativeNoun: _relativeNoun,
        timecomponents: _timecomponents,
        twelveHoursMode: format.includes('{{ampm}}'),
        filters: {
          fill: {
            active: filter_fill ? true : false,
            value: parseInt(filter_fill)
          }
        },
      }
    })
  });

  //Example of formatObject: 
  //[{"id":0,"format":{"raw":"{{wd}}","relativeNoun":null,"timecomponents":["wd"]}},{"id":1,"format":{"raw":"{{[at]h m s}}","relativeNoun":"at","timecomponents":["h","m","s"]}}]
  
  //Now, for each format object, we need to get the correct value of the time component it asks for
  formatObject.forEach((formatObject) => {
    var _relativeNoun = formatObject.format.relativeNoun
    var _timecomponents = formatObject.format.timecomponents
    var _12HoursMode = formatObject.format.twelveHoursMode
    var _value = ''
    _timecomponents.forEach((timecomponent) => {
      var _fsi_fill = 2;
      if (formatObject.format.filters.fill.active) {
        _fsi_fill = formatObject.format.filters.fill.value
      }
      switch (timecomponent) {
        case "ampm":
          if (this.hour >= 12) {
            _value += "PM"
          } else {
            _value += "AM"
          }
          break;
        case 'wd':
          _value += localizedRelativeNoun("wd", _relativeNoun, lang, this)
          break;
        case 'h':
          if ((_12HoursMode) && this.hour > 12) {
            _value += localizedRelativeNoun("h", _relativeNoun, lang, formatSingleInteger(this.hour-12, _fsi_fill) + "]h")
          } else {
            _value += localizedRelativeNoun("h", _relativeNoun, lang, formatSingleInteger(this.hour, _fsi_fill) + "]h")
          }
          break;
        case 'm':
          if (_value.includes(']h')) {
            _value += ':' + formatSingleInteger(this.minute) + ']m'
          } else {
            _value += localizedRelativeNoun("m", _relativeNoun, lang) + formatSingleInteger(this.minute, _fsi_fill) + ']m'
          }
          break;
        case 's':
          if (_value.includes(']m')) {
            _value += ':' + formatSingleInteger(this.second) + ']s'
          } else {
            _value += localizedRelativeNoun("s", _relativeNoun, lang) + formatSingleInteger(this.second, _fsi_fill) + ']s'
          }
          break;
      }
    })

    _value = _value.replace(/]h/g, '').replace(/]m/g, '').replace(/]s/g, '')

    formatObject.value = _value
  })

  //Finally, we need to replace the format object in the original string with the value
  var result = format;
  formatObject.forEach((formatObject) => {
    result = result.replace(formatObject.format.raw, formatObject.value)
  })
  return result
};

/**
 * @author Andrés
 * @date 2022-10-04
 * @param {Number} integer
 * @param {Number} fillAmount=0
 * @returns {string}
 */
function formatSingleInteger(integer, fillAmount = 1) {
  if (fillAmount) {
    return integer.toString().padStart(fillAmount, '0')
  } else {
    return integer.toString()
  }
}

function localizedRelativeNoun(timecomponent, relativeNoun, lang, value=null) {
  if (relativeNoun) {
    switch (relativeNoun){
      case 'at':
        switch (lang) {
          case 'en':
            switch (timecomponent) {
              case 'h':
                return 'at ' + value
              case 'wd':
                return 'on ' + value.weekdayLong
              default:
                return ''
            }
          case 'es':
            switch (timecomponent) {
              case 'h':
                return 'a las ' + value
              case 'wd':
                return 'el ' + value.weekdayLong
              default:
                return ''
            }
          }
      //rpf: relative past future
      case 'rpf':
        var _now = DateTime.local()
        switch (lang) {
          case 'en':
            switch (timecomponent) {

              case 'h':
                var _diff_h = _now.hour - value
                if (_diff_h > 0) {
                  return 'in ' + value
                } else {
                  return value + ' ago'
                }
              case 'm':
                var _diff_m = _now.minute - value
                if (_diff_m > 0) {
                  return 'in ' + value
                } else {
                  return value + ' ago'
                }
              case 's':
                var _diff_s = _now.second - value
                if (_diff_s > 0) {
                  return 'in ' + value
                } else {
                  return value + ' ago'
                }
              case 'wd':
                var _diff_wd = value.weekday - _now.weekday
                var _diff_wn = _now.weekNumber - value.weekNumber
                if (_diff_wn == 0) {
                  if (_diff_wd == 0) {
                    return 'today'
                  } else if (_diff_wd == 1) {
                    return 'tomorrow'
                  } else if (_diff_wd == -1) {
                    return 'yesterday'
                  } else {
                    return "this " + value.weekdayLong
                  }
                } else if (_diff_wn == 1) {
                  return "last " + value.weekdayLong
                } else if (_diff_wn == -1) {
                  return "next " + value.weekdayLong
                } else {
                  return "this " + value.weekdayLong
                }
              default:
                return ''
            }
          case 'es':
            switch (timecomponent) {
              case 'h':
                var _diff_h = _now.hour - value
                if (_diff_h > 0) {
                  return 'en ' + value
                } else {
                  return value + ' atrás'
                }
              case 'm':
                var _diff_m = _now.minute - value
                if (_diff_m > 0) {
                  return 'en ' + value
                }
                else {
                  return value + ' atrás'
                }
              case 's':
                var _diff_s = _now.second - value
                if (_diff_s > 0) {
                  return 'en ' + value
                } else {
                  return value + ' atrás'
                }
              case 'wd':
                var _diff_wd = value.weekday - _now.weekday
                var _diff_wn = _now.weekNumber - value.weekNumber
                if (_diff_wn == 0) {
                  if (_diff_wd == 0) {
                    return 'hoy'
                  } else if (_diff_wd == 1) {
                    return 'mañana'
                  } else if (_diff_wd == -1) {
                    return 'ayer'
                  } else {
                    return "este " + value.weekdayLong
                  }
                } else if (_diff_wn == 1) {
                  return "el pasado " + value.weekdayLong
                } else if (_diff_wn == -1) {
                  return "el próximo " + value.weekdayLong
                } else {
                  return "este " + value.weekdayLong
                }
              default:
                return ''
            }
          }
      default:
        if (value) {
          return value
        }
        return ''
    }
  } else {
    if (value) {
      return value
    }
    return ''
  }
}


module.exports = {
  DateTime
};

//Test
// var now = DateTime.local().minus({days: 1}).minus({hours: 8, minutes: 30, seconds: 15});
// console.time('test-mine')
// console.log(now.toRelativeCalendarAdvanced("<span class=\"time\">{{[rpf]wd}} at {{m}} minutes and {{s|f:10}} seconds after {{h|f:2}} {{ampm}}, {{s}} seconds </span>", 'es'))
// console.timeEnd('test-mine')
// console.time('test-luxon')
// console.log(now.toRelativeCalendar())
// console.timeEnd('test-luxon')