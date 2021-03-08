const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class Translator {
  
  constructor() {
    var toAmericanTitles = {};
    var toAmericanSpelling =  {};
    for (let key in americanToBritishTitles) {
      toAmericanTitles[americanToBritishTitles[key]] = key;
    }
    for (let key in americanToBritishSpelling) {
      toAmericanSpelling[americanToBritishSpelling[key]] = key;
    }
    
    this.toAmTitles = toAmericanTitles;
    this.toAmSpelling = toAmericanSpelling;
  }
  
  getTranslation(term, instructions) {
    let translated = "";
    
    if (instructions === "american-to-british") {
      translated = americanOnly[term] || americanToBritishSpelling[term] || americanToBritishTitles[term] || term; 
      if (/^\d{1,2}[:]\d{2}[ap]m$/.test(term) || /^\d{1,2}[:]\d{2}$/.test(term)) {
        translated = term.replace(":", ".");
        }
    } else {
      translated = britishOnly[term] || this.toAmSpelling[term] || this.toAmTitles[term] || term;
      if (/^\d{1,2}[.]\d{2}[ap]m$/.test(term) || /^\d{1,2}[.]\d{2}$/.test(term)) {
        translated = term.replace(".", ":");
        }
    }
		
		if (translated === this.toAmTitles[term] || translated === americanToBritishTitles[term]) {
      	translated = '<span class="highlight">' + translated[0].toUpperCase() + translated.substring(1) + '</span>';
    } else if (translated !== term) {
      	translated = '<span class="highlight">' + translated + '</span>';
      }
    
    return translated;
  }
  
  translate(text, from_to) {
    
    var text_str = text.trim();
    var end_mark = /\w[!?.]$/.test(text_str) ? text_str.slice(-1) : "";
    if (end_mark) { text_str = text_str.substring(0, text_str.length - 1) }
    var translation = "";
    // Traverse the text string to find possible translation
    while (text_str) {
    	/* Delimit words with spaces. Add a space between words to translate. Non alphanumeric characters at the
      beginning of the word are not tranlated and left as such at the same position. For translation, at first
      encounter with a word character, delimit a group of possible three words to translate as a whole expression.
      Retry translation by subsequently slicing expression at the end by alphanumeric string delimited by non-word
      characters, if plausible.
      Slice the translated expression in the text being translated, in this case "text_str"
      */
      if ((/^\s/).test(text_str)) {
      
      	translation += /\s$/.test(translation) ? "" : " ";
        text_str = text_str.replace(/^\s+/, "");
        
      } else if ((/^\W+/m).test(text_str)) {
      	translation += text_str.match(/^\W+/)[0];
        text_str = text_str.replace(/^\W+/, "");
        
      } else {
      
      	let expression = text_str.match(/\S+\s*\S*\s*\S*/)[0].split(/\s+/).join(" ");
        let check_Exp = expression.toLowerCase();
        let translated = "";
      
        while (check_Exp) {
          translated = this.getTranslation(check_Exp, from_to);
          if (translated === check_Exp) {
            let sliced = check_Exp.replace(/\s\w+$|[^A-Za-z0-9_.]+\w*$|[.]+\w*$/, "")
            check_Exp = check_Exp !== sliced ? sliced : "";
            expression = expression.replace(/\s\w+$|[^A-Za-z0-9_.]+\w*$|[.]+\w*$/, "");
          } else {
            break;
          }
      	}
        if (expression.toLowerCase() === translated) {
          translated = expression;
        }
				translation += /^\S/.test(translation) ? translated : translated[0].toUpperCase() + translated.substring(1);
        text_str = text_str.replace(expression, "");
      }

      }
    translation += end_mark;
    return translation;
  }
  
}

module.exports = Translator;