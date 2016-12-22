# Temperature Logger

I was curious if Tado measures temperature correctly (hint: it does). On other hand, it won't be shocking if they use the same sensor as mine - DS18B20.
Use of Raspberry Pi for reading temparature is almost crimianlly underuse of the hardware. Not to mention horribly over-engineered setup (resin, etc).
But I wanted to see how the whole setup (node.js + resin.io + InfluxDB + Chronograf + containers all over the place) will work. And admit it, talking to real hardware from node.js is impressive.

## Libraries
* Code uses https://github.com/chamerling/ds18b20 with full precision patch by colinrgodsey. Unfortunately pull request https://github.com/chamerling/ds18b20/pull/11 did not make it to the official package, hence I had to copy the file.
* resin.io setup is based on https://github.com/shaunmulligan/firebaseDTL
