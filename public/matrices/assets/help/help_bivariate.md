# FIRST KEY CONCEPT: Mean and Variation

In this study, we want to show two important things about flight prices in the U.S:

- What is the **mean price** (the average price) of a flight between two states.
- We want to show how stable these prices are — in other words, to show their **variation**.

### Mean

The **mean** is very simple: it’s just the **average price** you would expect to pay if you buy many flights on a route.

Imagine you took several flights between California and Texas.
One flight may cost $100, another $120, another $80.
If you add them up and divide that by how many flights you had, you get the mean — **the "typical" price** for the flights.

But wait — not all flights cost the same, sometimes you're paying much more than the average! Also, different routes can have differences in the variation of prices, even if their average fares are identical!

### Variation

Flight prices don’t always stick to the average. Sometimes they’re cheaper, sometimes more expensive. We call this how much prices vary around the mean.

**Low variation** means that prices are similar and stable.

**High variation** means that prices jump all over the place — sometimes they are cheap, sometimes expensive.

We measure those variations using a statistic called “standard deviation,” but no worries—you don’t need to remember the term or understand the math. Just know that looking at both the mean and the variation tells you the approximate range where flight prices tend to fall.

##### Example:

Suppose we compare two routes. California - Nevada (mean price: $100, variation: $50) and New York - Pennsylvania (mean price: $100, variation: $5). Even thought both routes have the same mean, flight prices behave differently:

- California - Nevada: **variation is high**, some flights cost **$50, some $100, some $150!**
- New York - Pennsylvania: **variation is low**, most flights cost something like **$95, $100, $105.**

So even if two pairs of states have the **same average price**, one might be very **predictable** and the other very **unpredictable.**

# SECOND KEY CONCEPT: Adjacency Matrices

Adjacency matrices are a structured way to represent networks. In our network, we have US States (nodes) and flights (links) that connect them. An adjacency matrix captures this information in a table format, where a cell shows whether there is a link between a pair of nodes, in our case a flight between two states.

Think of an adjacency matrix like a table:

- The **rows and columns** represent the **states**.
- Each **cell** at the intersection of a row and a column tells you if there are **flights between those two states**.

In our case a network and its associated adjacency matrix will look something like this:

<img src='../matrices/assets/images/graph&matrix.svg' width='1000'>
<br>

You can match the graph to the matrix. For instance, states **A and B are connected**, their **mean flight price is $100** and the **variation is only $5**, so prices don’t fluctuate much on that route. In contrast, flights between **A and D** are both **expensive and highly variable**, so while you’ll usually pay more, there’s also a better chance of finding either a great bargain or a very pricey ticket.

When you see an empty space in the matrix, it means there is **no direct flight between those two states** (for example, A to C). You’ll also notice little circles on A, B, and E: These are self-connections, indicating that each state has **internal flights** (for example, flying between different cities within A), in the matrix **self-connections always lie on the diagonal** (A to A, B to B, and so on).

Finally, the upper‑ (above the diagonal) and lower‑triangle (below the diagonal) of the matrix are mirrored because we’ve simplified things by assuming that prices from X to Y equal prices from Y to X.

# THIRD KEY CONCEPT: Encoding

As you might notice, if the network grows it will be very difficult to read the values on a graph or on the presented adjacency matrices. We have developed a way of encoding mean and variation to visualize this kind of networks.

##### Color encodes the mean:

Each cell in the matrix will have a color:

- If the color is light, the mean flight price is low.
- If the color is dark, the mean flight price is high.

So, lighter = cheaper and darker = more expensive.

<img src='../matrices/assets/images/legend_bivariate.svg' width='500'>

##### Lightness encodes the variation.

Each cell will can have 5 levels of luminance:

- A low luminance (intense color) means prices are very stable (they don't change much).
- A high luminance (color is almost white) means prices are all over the place (they change a lot!).

So, low luminance = consistent prices, high luminance = unpredictable prices.
