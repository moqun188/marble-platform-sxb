# Marble Knowledge Graph API Documentation

> Base URL: `http://124.222.188.198:3200`
> Interactive docs: http://124.222.188.198:3200/api/docs

## Endpoints

### System

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check — returns status + topic/dep counts |

### Topics

| Method | Path | Description |
|---|---|---|
| GET | `/api/topics` | List topics with filtering (subject, domain, type, age, q) |
| GET | `/api/topics/:id` | Single topic detail |
| GET | `/api/topics/:id/prereqs` | Prerequisites of a topic |
| GET | `/api/topics/:id/unlocks` | Topics unlocked by this topic |
| GET | `/api/topics/:id/path` | Learning path from entry to target (BFS) |

### Meta

| Method | Path | Description |
|---|---|---|
| GET | `/api/subjects` | 8 subjects with counts + domains |
| GET | `/api/domains` | All domains with counts |
| GET | `/api/clusters` | Parent-friendly domain summaries (filter by subject/domain) |
| GET | `/api/standards` | Curriculum standards (filter by curriculum slug) |
| GET | `/api/graph` | Full graph data for visualization (filter by subject) |

## Query Parameters

### GET /api/topics

| Param | Type | Default | Description |
|---|---|---|---|
| subject | string | — | Filter by subject name |
| domain | string | — | Filter by domain name |
| type | string | — | CONCEPTUAL, PROCEDURAL, REPRESENTATIONAL, LANGUAGE, META |
| ageMin | int | — | Minimum starting age |
| ageMax | int | — | Maximum ending age |
| q | string | — | Full-text search in name + description |
| limit | int | 50 | Max results (max 200) |
| offset | int | 0 | Pagination offset |

### GET /api/graph

| Param | Type | Description |
|---|---|---|
| subject | string | Filter to single subject |

## Data Model

### Topic

```json
{
  "id": "mt_N8CpN1EJrP",
  "type": "CONCEPTUAL",
  "subject": "English",
  "domain": "Grammar & Punctuation",
  "name": "Building sentences",
  "description": "Understand that words combine to make sentences...",
  "ageRangeStart": 4,
  "ageRangeEnd": 6,
  "centrality": 0.257,
  "evidence": ["Distinguish between complete sentences and fragments"],
  "assessmentPrompt": "If {{name}} says something like 'The dog'...",
  "standards": ["ccss-ela:L.K.1f", "uk-nc-2013:Eng.App2.Y1.Sent.1"]
}
```

### Dependency Edge

```json
{
  "topicId": "mt__00ZSLnB7p",
  "prerequisiteId": "mt_VBl1T1sFCM",
  "strength": "hard",
  "reason": "Must understand vibrations make sound before finding volume patterns"
}
```

### Graph (for visualization)

```json
{
  "nodes": [{ "id": "mt_xxx", "label": "Building sentences", "subject": "English", ... }],
  "edges": [{ "source": "mt_yyy", "target": "mt_xxx", "strength": "hard", ... }]
}
```

## Examples

```bash
# All Mathematics topics
curl "http://124.222.188.198:3200/api/topics?subject=Mathematics"

# Search for "fractions"
curl "http://124.222.188.198:3200/api/topics?q=fractions&limit=5"

# Learning path to a specific topic
curl "http://124.222.188.198:3200/api/topics/mt_N8CpN1EJrP/path"

# Science graph data (for Cytoscape.js)
curl "http://124.222.188.198:3200/api/graph?subject=Science"

# UK National Curriculum standards
curl "http://124.222.188.198:3200/api/standards?curriculum=uk-nc-2013"
```
