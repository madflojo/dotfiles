# Code Review Criteria

Use this reference when the review target is primarily code.

## Code Quality

- Readability: Is the code easy to follow?
- Consistency: Does it follow repo and language conventions?
- Simplicity: Is the logic as simple and clear as it can be?
- Correctness: Are there obvious bugs or questionable decisions?

## Architecture and Design

- Modularity: Is the code broken into reusable units?
- Separation of concerns: Are responsibilities well distributed?
- Scalability: Can the design handle meaningful growth?
- Extensibility: How easy is it to add new features safely?
- Testability: Is the structure easy to exercise in tests?

## Maintainability

- Documentation: Are README, comments, and supporting docs good enough?
- Test coverage: Are there meaningful tests for the risky paths?
- Error handling: Are failures handled with clear diagnostics?
- Dependency management: Are dependencies reasonable and well managed?

## Performance and Efficiency

- Resource use: CPU, memory, disk, and network behavior
- Benchmarking: Any evidence for performance-sensitive claims?
- Latency and critical path: Are bottlenecks acknowledged or improved?

## Security

- Input validation: Are inputs validated appropriately?
- Secrets management: Are credentials or tokens handled safely?
- Least privilege: Do components and APIs use minimal necessary access?

## Resiliency

- Defensive programming: Safe handling of edge cases and failure paths
- Failure scenarios: Graceful behavior under dependency or runtime failure
