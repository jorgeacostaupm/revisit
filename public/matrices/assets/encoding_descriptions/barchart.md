## THIRD KEY CONCEPT: Encoding

As you might notice, if the network grows it will be very difficult to read the values on a graph or on the presented adjacency matrices. We have developed a way of encoding mean and variation to visualize this kind of networks.

##### X color bar encodes the mean:

Each cell in the matrix will have a X color bar:

- If X color bar is short, the mean flight price is low.
- If X color bar is large, the mean flight price is high.

So, shorter = cheaper and larger = more expensive.

<img src='./assets/images/color-mean.svg' width='500'>

##### X color bar encodes the variation:

Each cell in the matrix will have a X color bar:

- If X color bar is short prices are very stable (they don't change much).
- If X color bar is large prices are all over the place (they change a lot!).

So, shorter = consistent prices and larger = unpredictable prices.

<img src='./assets/images/size-std.svg' width='500'>

Let's do some training exercises!
