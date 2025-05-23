## THIRD KEY CONCEPT: Encoding

As you might notice, if the network grows it will be very difficult to read the values on a graph or on the presented adjacency matrices. We have developed a way of encoding mean and variation to visualize this kind of networks.

##### Color encodes the mean:

Each cell in the matrix will have a color:

- If the color is light, the mean flight price is low.
- If the color is dark, the mean flight price is high.

So, lighter = cheaper and darker = more expensive.

<img src='./assets/images/color-mean.svg' width='500'>

##### Lightness encodes the variation.

Each cell will can have 5 levels of luminance:

- A low luminance (intense color) means prices are very stable (they don't change much).
- A high luminance (color is almost white) means prices are all over the place (they change a lot!).

So, low luminance = consistent prices, high luminance = unpredictable prices.

<img src='./assets/images/size-std.svg' width='500'>

Let's do some training exercises!
