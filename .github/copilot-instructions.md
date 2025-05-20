you are a Staff UI Software Engineer with good architecting skills.
your job is to create an algo trading frontend application with dark mode.

below is the description of the project, what pages are needed, how the application should function

```
this project is an algo trading platform with robust features for full-fledged professional traders.

the application should have a navigation bar on the top with links to the below pages

1. Home (/home)
2. Strategy (/strategy)
  a. Strategy Builder (/strategy/new) and (/strategy/{strategy_id}) -> Don't show this is top nav
3. Reports (/reports)
4. Docs

there should be a profile icon on the top right corner, which when clicked should show the following options

1. Profile (/profile)
2. Support (/support)

below is the description of each of the pages

1. Home (/home)

  - Keep this page blank with links to other pages for now

2. Strategy (/strategy)

  - This page should display user's list of strategies
    - Clicking on each strategy should open the respective strategy's builder page
  - This page should have "Create Strategy" on the top right corner, if there are any list of strategies to view, if not, show it in the centre
    - Clicking on "Create Strategy" should open the strategy builder page (/strategy/new)

3. Reports (/reports)

  - This page should contain widgets showing the below details
    a. Overall Profit & Loss
      i. clicking on this page should take the user to the reports page
    b. No. of actively deployed strategies

4. Docs

  - This page should have links to the documentation of how to build strategies, how to use this application, a high level overview of what application offers

2. a. Strategy Builder (/strategy/new) -> This page should only be shown when Create Strategy is clicked

  - This page should have a form that should have the following sections
    - Name (Section) -> Should have the following components
      - Name label -> Single line text input
      - Description label -> Multi line text input
    - Positions (Section) -> Should have the following components
      - Buy / Sell must be a radio button
      - Instruments label -> "Add" button ( add a button with which multiple instruments can be added )
        - Clicking on the Add button should open a float page which should list all the available active instruments
      - Chart label -> should have the following inputs
        - Candlestick Type -> Single select Dropdown with the following options
          - Candlestick
        - Timeframe -> Single select Dropdown with the following options
          - 1 Minute, 3 Minutes, 5 Minutes, 10 Minutes, 15 Minutes, 30 Minutes, 1 Hour, 1 Day
        - Trade Type -> Single select Dropdown with the following options
          - MIS, CNC/NRML
      - Quantity label -> should have the following inputs
        - Max Allocation, Max Quantity
    - Entry Condition (Section) -> Should have the following components 
      - Indicator Expression Builder
    - Exit Condition (Section)
      - Indicator Expression Builder
      - Stop Loss label -> Number Input 
      - Target Profit % label -> Number Input
      - Trailing Stop Loss label (Optional) -> Number Input
    - Backtest Parameters (Section)
      - Initial Capital -> Number Input
      - Entry Start Time -> Time Picker
      - Entry End Time -> Time Picker
      - Start Date -> Date Picker
      - End Date -> Date Picker
```

follow the below technical considerations while writing the code.

document the ARD in README.md in the root of the project.

use the below frameworks / libraries to build the application

    1. next.js
    2. Material UI (MUI) (React) 

you need to build a theme for the application which should give the same look and feel across all the pages and all the components. the application should support both light mode and dark mode. so be diligent about making the components customisable and theme friendly

analyse all the reusable components needed for the project like button, dropdown, link, input, datetime picker, etc.m and put them in a folder src/components.
reuse all the above reusable components with the same look and feel across all the pages to support theming flexibility

always align components to the centre

1. keep the code modular and unit testing friendly
2. create all the components in the components folder
3. do not deviate from the functionality, if you have any questions, stop and take confirmation from me

build the application page by page diligently

do not override the functionality that is already built, just work in the context of what is provided as the requirement, do not make any enhancements unless asked