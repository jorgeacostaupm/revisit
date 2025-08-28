# SECOND KEY CONCEPT: Adjacency Matrices

Adjacency matrices are a structured way to represent networks. In our network, we have US States (nodes) and flights (links) that connect them. An adjacency matrix captures this information in a table format, where a cell shows whether there is a link between a pair of nodes, in our case a flight between two states.

Think of an adjacency matrix like a table:

- The **rows and columns** represent the **states**.
- Each **cell** at the intersection of a row and a column tells you if there are **flights between those two states**.

In our case a network and its associated adjacency matrix will look something like this:

<img src='./matrices/assets/images/graph&matrix.svg' width='1000'>
<br>

You can match the graph to the matrix. For instance, states **A and B are connected**, their **mean flight price is $100** and the **variation is only $5**, so prices don’t fluctuate much on that route. In contrast, flights between **A and D** are both **expensive and highly variable**, so while you’ll usually pay more, there’s also a better chance of finding either a great bargain or a very pricey ticket.

When you see an empty space in the matrix, it means there is **no direct flight between those two states** (for example, A to C). You’ll also notice little circles on A, B, and E: These are self-connections, indicating that each state has **internal flights** (for example, flying between different cities within A), in the matrix **self-connections always lie on the diagonal** (A to A, B to B, and so on).

Finally, the upper‑ (above the diagonal) and lower‑triangle (below the diagonal) of the matrix are mirrored because we’ve simplified things by assuming that prices from X to Y equal prices from Y to X.
