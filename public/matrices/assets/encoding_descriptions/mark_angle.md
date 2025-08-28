# THIRD KEY CONCEPT: Encoding

As you might notice, if the network grows it will be very difficult to read the values on a graph or on the presented adjacency matrices. We have developed a way of encoding mean and variation to visualize this kind of networks.

##### Color encodes the mean:

Each cell in the matrix will have a color:

- If the color is light, the mean flight price is low.
- If the color is dark, the mean flight price is high.

So, lighter = cheaper and darker = more expensive.

<img src='./matrices/assets/images/mean_legend_mark.svg' style="width:500px;">

##### Mark angle encodes the variation.

Inside each cell, there will be a gray rectangular mark:

- A small angle (0°) means prices are very stable (they don't change much).
- A big angle (90°) means prices are all over the place (they change a lot!).

So, small angle = consistent prices, big angle = unpredictable prices.

<img src='./matrices/assets/images/std_legend_angle.svg' style="width:500px;">

Let's do some training exercises!
