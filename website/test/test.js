// validate that the parsing does not return any errors

// verify that the parsed tree matches the know data

// verify that the visitor returns the know json object

import antlr4 from 'antlr4';
import StarRealmsLexer from './antlr4/StarRealmsLexer.js';
import StarRealmsParser from './antlr4/StarRealmsParser.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

class Visitor {
    visitChildren(ctx) {
      if (!ctx) {
        return;
      }
  
      if (ctx.children) {
        let newNode = {}
        newNode[ctx.parser.ruleNames[ctx.ruleIndex]] = ctx.children.map(child => {
          if (child.children && child.children.length != 0) {
            return child.accept(this);
          } else {
            return child.getText();
          }
        });
        return newNode
      }
    }
  }

function getFolderFiles(folder){
    let my_list = []
    fs.readdirSync(folder).map(fileName => {
        let file_path = path.join(folder, fileName)
        if(fs.lstatSync(file_path).isFile()){
            my_list.push(file_path)
        }else{
            my_list.push(getFolderFiles(file_path))
        }
        return path.join(folder, fileName);
    });
    return my_list.flat()
}

axios.defaults.headers.post['Content-Type'] = 'application/json';
let test_input = getFolderFiles("logdata")
let parsing_error = 0
let tree_error_count = 0
let battle_error_count = 0
for(let i = 0; i < test_input.length; i++){
    console.log(`##########`)
    console.log(`testing file ${test_input[i]}`)
    //read input data to memory
    const log_data = fs.readFileSync(test_input[i], 'utf8');
    const chars = new antlr4.InputStream(log_data);
    const lexer = new StarRealmsLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new StarRealmsParser(tokens);
    parser.buildParseTrees = true;
    const tree = parser.battle()
    const tree_output = tree.accept(new Visitor())
    //check that parsing the file does not return any errors
    if(parser._syntaxErrors != 0){
      parsing_error += parser._syntaxErrors
      console.log(`Error: Unable to parse file ${test_input[i]} using grammar.`)
    }
    // test that the tree structure is unchanged
    const treefile = "trees" + test_input[i].substring(7)
    try {
      const tree_data = fs.readFileSync(treefile, 'utf8');
      let json1 = JSON.stringify(JSON.parse(tree_data))
      let json2 = JSON.stringify(tree_output)
      if(json1 != json2){
        tree_error_count += 1
        console.log(`Error: The tree structure has changed for file ${test_input[i]}`)
      }
    } catch (err) {
      if(err.syscall == 'open'){
        console.log(`Error: missing file ${treefile}. Writing latest data to it.`)
        fs.writeFileSync(treefile, JSON.stringify(tree_output, null, 2), 'utf8');
      }else{
        console.log(err)
      }
    }
    //test that the battle object is unchanged
    //fs.writeFileSync(tree_outfile, JSON.stringify(tree_output, null, 2), 'utf8');
    const battlefile = "battledata" + test_input[i].substring(7)
    await axios
      .post('http://localhost:3000/api/test', JSON.stringify(log_data),)
      .then(res => {
        try {
          const battle_data = fs.readFileSync(battlefile, 'utf8');
          let json1 = JSON.stringify(res.data)
          let json2 = JSON.stringify(JSON.parse(battle_data))
          if(json1 != json2){
            battle_error_count += 1
            console.log(`Error: The battle object has changed for file ${test_input[i]}`)
          }
        } catch (err) {
          if(err.syscall == 'open'){
            console.log(`Error: missing file ${battlefile}. Writing latest data to it.`)
            fs.writeFileSync(battlefile, JSON.stringify(res.data, null, 2), 'utf8');
          }else{
            console.log(err)
          }
        }
      })
      .catch(error => {
        console.error(error);
    });
}
console.log("")
console.log(`##########`)
console.log(`testing summary`)
console.log(`found ${parsing_error} parsing error(s)`)
console.log(`found ${tree_error_count} tree generation error(s)`)
console.log(`found ${battle_error_count} battle object error(s)`)
console.log(`##########`)