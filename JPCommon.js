//
//
//  JPCommon.js
//
//  Created by zzyong on 2020/03/20.
//  Copyright © 2020 zzyong. All rights reserved.
//

let JPClassBeginTag         = "@implementation";
let JPClassEndTag           = "@end";
let JPReturnKey             = "return";
let JPLetfSquareBracket     = "[";
let JPRightSquareBracket    = "]";
let JPIfKey                 = "if";
var JPAspectDefineClass     = [];
var JPConditionIndex        = 0;
var JPAspectLocalInstance   = [];

// JPFormatCondition
function JPFormatCondition(aspectMessages, JSParseLocalInstanceList, condition)
{
  condition = condition.trim();
  // 替换 YES
  condition = condition.replace("YES", "1");
  // 替换 NO
  condition = condition.replace("NO", "0");

  let JPInstance = null;
  let noCharidx = condition.indexOf("!");
  if (noCharidx != -1) {
    condition = condition.substring(1);
    JPInstance = JSParseLocalInstanceList[condition];
  } else {
    if (JPOperator(condition) == null) {
      JPInstance = JSParseLocalInstanceList[condition];
    }
  }

  if (JPInstance == null) {
    return condition;
  }

  if (JPAspectLocalInstance.indexOf(condition) == -1) {
    let msg = JPAspectMessage();
    msg.message = condition + "=" + String(JPInstance["type"]) + ":" + JPInstance["value"];
    msg["messageType"] = 2;
    aspectMessages.push(msg);
  }

  if (JPInstance["type"] == 3) {
    if (noCharidx != -1) {
      condition = condition + "==0";
    } else {
      condition = condition + "==1";
    }
  }

  if (JPInstance["type"] == 1) {
    if (noCharidx == -1) {
      condition = condition + "!=nil";
    }
  }

  return condition;
}

// JPInvokeCondition
function JPInvokeCondition(conditionKey, condition)
{
  let aspectMessage = {
    "invokeCondition" : {
      "condition" : condition,
      "operator" : JPOperator(condition),
      "conditionKey" : conditionKey
    }
  };

  return aspectMessage;
}

// 运算符
function JPOperator(condition)
{
  if (condition.indexOf(">=") != -1) {
    return ">=";
  }

  if (condition.indexOf(">") != -1) {
    return ">";
  }

  if (condition.indexOf("<=") != -1) {
    return "<=";
  }

  if (condition.indexOf("<") != -1) {
    return "<";
  }

  if (condition.indexOf("==") != -1) {
    return "==";
  }

  if (condition.indexOf("!=") != -1) {
    return "!=";
  }

  if (condition.indexOf("&&") != -1) {
    return "&&";
  }

  if (condition.indexOf("||") != -1) {
    return "||";
  }

  return null;
}

// JSParseInstance
function JSParseInstance(type, value)
{
  return {
    "type": type,
    "value": value
  };
}

// JPArgument
function JPArgument(index, type, value)
{
  return {
    "index": index,
    "type": type,
    "value": value
  };
}

// 弹窗
function JPAlert(content)
{
  alert(content);
}

// 移除语句所有多余的空格符
function JPRemoveObjectiveCStatementUnuseWhiteSpace(statement)
{
  // 移除开始结尾空格
  var tempStatement = statement.trim();

  // 移除 = 前后空格
  if (tempStatement.indexOf("=")) {
    tempStatement = tempStatement.replace(/\s*=\s*/igm, "=");
  }

  // 移除 * 前后空格
  if (tempStatement.indexOf("*")) {
    tempStatement = tempStatement.replace(/\s*\*\s*/igm, "*");
  }

  // 移除 [ 前后空格
  tempStatement = tempStatement.replace(/\s*\[\s*/igm, "[");

  // 移除 ] 前后空格
  tempStatement = tempStatement.replace(/\s*\]\s*/igm, "]");

  // 移除 : 前后空格
  tempStatement = tempStatement.replace(/\s*:\s*/igm, ":");

  // 移除 @ 前后空格
  if (tempStatement.indexOf("@") != -1) {
    tempStatement = tempStatement.replace(/\s*@\s*/igm, "@");
  }

  // 移除 " 前后空格
  if (tempStatement.indexOf("\"") != -1) {
    tempStatement = tempStatement.replace(/\s*"\s*/igm, "\"");
  }

  // 移除 ( 前后空格
  if (tempStatement.indexOf("(") != -1) {
    tempStatement = tempStatement.replace(/\s*\(\s*/igm, "(");
  }

  // 移除 ) 前后空格
  if (tempStatement.indexOf(")") != -1) {
    tempStatement = tempStatement.replace(/\s*\)\s*/igm, ")");
  }

  // 移除 . 前后空格
  if (tempStatement.indexOf(".") != -1) {
    tempStatement = tempStatement.replace(/\s*\.\s*/igm, ".");
  }

  return tempStatement;
}

/**
 * message: "",
 * invokeCondition: {},
 * messageType: 0: 方法调用; 1: 返回语句; 2: 赋值语句
 * arguments: {},
 * localInstanceKey: "",
 */
function JPAspectMessage() 
{
    var aspectMessage = {
        message: ""
    };
    return aspectMessage;
}

/**
 * className
 * selName
 * isClassMethod
 * hookType
 * argumentNames
 * customMessages
 */
function JPClassAspect(className, isClassMethod)
{
    var classAcpset = {
        className: className,
        selName: "",
        isClassMethod: isClassMethod,
        hookType: 1,
    };
    return classAcpset;
}

/**
 * 获取圆括号里面的内容,例如从 (BOOL) 获取 BOOL
 * @param {String} contentString 
 */
function getBracketsValue(contentString)
{
  if (contentString == null) {
    return null;
  }

  contentString = contentString.trim();

  let leftBracketIdx = contentString.indexOf("(");
  if (leftBracketIdx == -1) {
    return contentString;
  }

  return contentString.substring(leftBracketIdx + 1, contentString.indexOf(")"));
}

/**
 * 返回函数返回类型
 * @param typeString  返回类型，格式：BOOL
 */
function JPArgumentType(typeString)
{
  // JPArgumentTypeUnknown
  var argumentType = 0;

  do {
    if (typeString == null) {
      break;
    }

    typeString = typeString.trim();

    if (typeString == "void") {
      break;
    }

    if (typeString == "id" || typeString == "instancetype" || typeString.indexOf("*") != -1) {
      argumentType = 1;
    } else if (typeString == "Class") {
      argumentType = 2;
    } else if (typeString == "BOOL" || typeString == "bool") {
      argumentType = 3;
    } else if (typeString == "NSInteger" || typeString == "long") {
      argumentType = 4;
    } else if (typeString == "NSUInteger" || typeString == "unsigned long") {
      argumentType = 5;
    } else if (typeString == "short") {
      argumentType = 6;
    } else if (typeString == "unsigned short") {
      argumentType = 7;
    } else if (typeString == "long long") {
      argumentType = 8;
    } else if (typeString == "unsigned long long") {
      argumentType = 9;
    } else if (typeString == "float") {
      argumentType = 10;
    } else if (typeString == "double" || typeString == "CGFloat") {
      argumentType = 11;
    } else if (typeString == "int") {
      argumentType = 12;
    } else if (typeString == "unsigned int") {
      argumentType = 13;
    } else if (typeString == "SEL") {
      argumentType = 14;
    } else if (typeString == "CGSize") {
      argumentType = 15;
    } else if (typeString == "CGPoint") {
      argumentType = 16;
    } else if (typeString == "CGRect") {
      argumentType = 17;
    } else if (typeString == "UIEdgeInsets") {
      argumentType = 18;
    } else if (typeString == "NSRange") {
      argumentType = 19;
    } else {
      JPAlert("不支持该类型: " + typeString);
    }     

  } while (0);

  return argumentType;
}