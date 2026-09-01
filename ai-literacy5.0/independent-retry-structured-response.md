# Independent Retry Structured Response

AIResponseRecord `ai-response-record/1.4` adds nullable `independentRetry` while preserving historical schemas. It references versioned task, attempt, evidence, and feedback records. Applicability, policy, resource permissions, support state, task validity, and evidence are trusted server fields; unknown fields are rejected. Answer keys never enter the response record.
