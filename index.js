const express = require('express')
const PORT = process.env.PORT || 5000


const app = express()
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello Your app is working')
})

app.post('/split-payments/compute', (req, res) => {
    const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body

    let currentBalance = Amount
    let totalRatio = SplitInfo.filter(split => {
          return split.SplitType === 'RATIO'
    }).reduce((acc, curr) => acc + curr.SplitValue, 0)
    
    let  orderSplit = SplitInfo.sort((a, b) => {
        if (a.SplitType < b.SplitType) {
              return -1
        } else {
              return 1
        }
    })

    let SplitBreakdown = orderSplit.map(split => {
          if (split.SplitType === 'FLAT') {
              split.Amount = split.SplitValue
              currentBalance -= split.SplitValue
              return {
                    SplitEntityId: split.SplitEntityId,
                    Amount: split.Amount
              }
          } else if (split.SplitType === 'PERCENTAGE') {
               let percentage = (split.SplitValue / 100) * currentBalance
              split.Amount = percentage
              currentBalance -= percentage
              return {
                    SplitEntityId: split.SplitEntityId,
                    Amount: split.Amount
              }
          } else if (split.SplitType === 'RATIO') {

              let ratioAmount = currentBalance
              let ratio = (split.SplitValue / totalRatio) * ratioAmount
              split.Amount = ratio
              currentBalance -= ratio
              return {
                    SplitEntityId: split.SplitEntityId,
                    Amount: split.Amount
              }
          }
    })

    console.log(SplitBreakdown)

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

