# Loading

## Strategy

| Situation | Pattern |
| --- | --- |
| List/card placeholders | `LoadingRows` / `Skeleton` |
| Whole panel | `LoadingBlock` |
| Button pending | disable + `Spinner` inside button |

## Do

- Reserve layout height to avoid jump.
- Prefer skeletons that mirror final structure.
