# Mode: ofertas — Multi-Offer Comparison

Use a weighted 10-dimension matrix:

| Dimension | Weight | 1-5 Criteria |
|-----------|--------|--------------|
| North Star alignment | 25% | 5=exact target role, 1=unrelated |
| CV match | 15% | 5=90%+ fit, 1=<40% |
| Level (senior+) | 15% | 5=staff+, 1=junior |
| Estimated compensation | 10% | 5=top quartile, 1=below market |
| Growth trajectory | 10% | 5=clear path, 1=dead end |
| Remote quality | 5% | 5=full async remote, 1=onsite only |
| Company reputation | 5% | 5=strong employer signal, 1=red flags |
| Stack modernity | 5% | 5=modern AI stack, 1=legacy |
| Time to offer | 5% | 5=fast process, 1=very slow |
| Cultural signals | 5% | 5=builder culture, 1=bureaucratic |

For each offer: score each dimension and calculate weighted total.
Return ranking + recommendation with time-to-offer trade-offs.

If offers are missing, ask user to provide text, URLs, or tracker references.
