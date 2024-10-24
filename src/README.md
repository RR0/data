# Data

All RR0 data types share common properties from their `RR0Data` interface.

Also, all RR0Data have other RR0Data types as properties, such as:

- [place](../place/README.md)
- [people](../people/README.md)
- [events[]](../event/README.md)

```mermaid
classDiagram
    class RR0Data {
        id: string
        type: string
        title: string
        name: string
        time: TimeContext
        dirName: string
        url?: string
    }
    RR0Data --> Place: place?
    RR0Data --> People: people?
    RR0Data --> RR0Data: events[]
    class Sighting {
    }
    RR0Data <|-- Sighting
    class People {
    }
    RR0Data <|-- People
    class Organization {
    }
    RR0Data <|-- Organization
    class Place {
    }
    RR0Data <|-- Place
    class Case {
    }
    RR0Data <|-- Case
    class Source {
    }
    RR0Data <|-- Source
    class Investigation {
    }
    RR0Data <|-- Investigation
```
