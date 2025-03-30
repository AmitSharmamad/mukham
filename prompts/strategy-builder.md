create a strategy expression builder which should display the expression as a string
and has a builder using its respective components

create a separate react component for this strategy builder

example: 

there are 3 components

1. Indicator Component which should have the following sub components
    a. Indicator and its config (like SMA, EMA, Number)
    b. Indicator Operator (like CrossesAbove, CrossesBelow)
    c. Indicator and its config (like SMA, EMA, Number)
2. Logical Operator (like AND, OR)
3. Indicator Component which should have the following sub components
    a. Indicator and its config (like SMA, EMA, Number)
    b. Indicator Operator (like CrossesAbove, CrossesBelow)
    c. Indicator and its config (like SMA, EMA, Number)

a user should be able to build an expressionn using the above components in its exact order

a label should be displayed that shows the expression in a string format like "EMA(close, 5) CrossesAbove 21000 AND EMA(close, 5) CrossesAbove 21000"

under the hood the following json should be constructed based off of the input provided by the user sticking to the below schema

{
  "type": "ExpressionStatement",
  "returns": "bool",
  "value": {
    "type": "LogicalExpression",
    "operator": "AND",
    "returns": "bool",
    "lhs": {
      "type": "IndicatorExpression",
      "operator": "CrossesAbove",
      "returns": "bool",
      "lhs": {
        "type": "Indicator",
        "name": "EMA",
        "point": "close",
        "returns": "float",
        "value": {
          "period": 5,
          "offset": 0
        }
      },
      "rhs": {
        "type": "Number",
        "name": "Number",
        "point": "close",
        "returns": "float",
        "value": {
          "value": 21000
        }
      }
    },
    "rhs": {
      "type": "IndicatorExpression",
      "operator": "CrossesAbove",
      "returns": "bool",
      "lhs": {
        "type": "Indicator",
        "name": "EMA",
        "point": "close",
        "returns": "float",
        "value": {
          "value": {
            "period": 5,
            "offset": 0
          }
        }
      },
      "rhs": {
        "type": "Number",
        "name": "Number",
        "point": "close",
        "returns": "float",
        "value": {
          "value": 21000
        }
      }
    }
  }
}


make the following mandatory, make rest optional

1. name
2. position type buy / sell, don't add any default selection to this
3. candle stick type
4. timeframe
5. trade type
6. entry condition
7. stop loss 
8. target profit
9. add a type to this that has Absolute and Percentage (new field to be added)
10. initial capital
11. start date
12. end date

add "Add Instrument" button to strategy button to posittions beside position type

clicking the button should open a modal which should have search instrument functionality

add this component https://mui.com/material-ui/react-autocomplete/#multiple-values for search

add Select and Close buttons at the buttom

once select button is clicked, display the chips adjacent to Add Instrument button