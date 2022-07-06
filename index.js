const express = require('express')
const PORT = process.env.PORT || 5000;

const app = express()
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello Your app is working')
})

app.post('/split-payments/compute', (req, res) => {

  // Collect request body from post endpoint
    const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body

    let currentBalance = Amount


  // Determine the total number of ratio in the ratio split type

    let totalRatio = SplitInfo.filter(split => {
          return split.SplitType === 'RATIO'
    }).reduce((acc, curr) => acc + curr.SplitValue, 0)
    

  // Order the split type as instructed
    let  orderSplit = SplitInfo.sort((a, b) => {
        if (a.SplitType < b.SplitType) {
              return -1
        } else {
              return 1
        }
    })

  // split length
  if (SplitInfo.length > 20) {
    res.status(400).json({
          "Error": 400,
          "Message": 'No of split exceeds limit (20), reduce your splits and try aagain'
    })
  }

  //  split calculation
    let SplitBreakdown = orderSplit.map(split => {
          if (split.SplitType === 'FLAT') {

              split.Amount = split.SplitValue
              currentBalance -= split.SplitValue

              if (split.Amount > Amount || split.Amount < 0) {
                res.status(400).json({
                  "Error": 400,
                  "Message": 'flat split exceeds balance or below zero'
              })
              }

              return {
                    SplitEntityId: split.SplitEntityId,
                    Amount: split.Amount
              }

          } else if (split.SplitType === 'PERCENTAGE') {

              let percentage = (split.SplitValue / 100) * currentBalance
              split.Amount = percentage
              currentBalance -= percentage

              if (split.Amount > Amount || split.Amount < 0) {
                res.status(400).json({
                  "Error": 400,
                  "Message": 'percentage split exceeds balance or below zero'
              })
              }

              return {
                    SplitEntityId: split.SplitEntityId,
                    Amount: split.Amount
              }

          } else if (split.SplitType === 'RATIO') {
            
              let ratioAmount = currentBalance
              let ratio = (split.SplitValue / totalRatio) * ratioAmount
              split.Amount = ratio
              currentBalance -= ratio

              if (split.Amount > Amount || split.Amount < 0) {
                res.status(400).json({
                  "Error": 400,
                  "Message": 'ratio split exceeds balance or below zero'
              })
              }

              return {
                    SplitEntityId: split.SplitEntityId,
                    Amount: split.Amount
              }
          }
    })


    if (currentBalance < 0) {
      res.status(400).json({
          "Error": 400,
          "Message": 'Transaction Exceeds Limit'
    })
    }

    res.status(200).json({
          "ID": ID,
          "Balance": currentBalance,
          "SplitBreakdown": SplitBreakdown
    })

})


app.use('*', (req, res) => {
    res.send('Get Away')
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

