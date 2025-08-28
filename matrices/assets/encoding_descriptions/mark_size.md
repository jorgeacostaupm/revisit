# THIRD KEY CONCEPT: Attribute Encoding

As you might notice, if the network grows it will be very difficult to read the values on a graph or on the presented adjacency matrices. We use a way of encoding mean and variation to visualize this kind of networks.

##### Color encodes the mean price:

Each cell in the matrix will have a color:

- If the color is light, the mean flight price is low.
- If the color is dark, the mean flight price is high.

So, lighter is cheaper and darker is more expensive.

<img src='./matrices/assets/images/mean_legend_mark.svg' width='500'>

##### Mark size encodes the price variation.

Inside each cell, there is a gray square:

- A tiny gray square means prices are very stable (they don't change much).
- A big gray square means prices are all over the place (they change a lot!).

So, small gray square = consistent prices, big gray square = unpredictable prices.

<img src='./matrices/assets/images/std_legend_size.svg' width='500'>

Let's do some training exercises!
