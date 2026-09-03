import { getById } from "../services/data.js";

// Validate topic ID format
export function validateTopicId(req, res, next) {
  const { id } = req.params;
  if (!id || !/^mt_[a-zA-Z0-9]+$/.test(id)) {
    return res.status(400).json({
      error: "Invalid topic ID",
      message: "Topic ID must match format: mt_xxxxx",
    });
  }
  next();
}

// Validate pagination params
export function validatePagination(req, res, next) {
  const { limit, offset } = req.query;
  if (limit !== undefined) {
    const n = Number(limit);
    if (isNaN(n) || n < 1 || n > 500) {
      return res.status(400).json({
        error: "Invalid limit",
        message: "Limit must be a number between 1 and 500",
      });
    }
  }
  if (offset !== undefined) {
    const n = Number(offset);
    if (isNaN(n) || n < 0) {
      return res.status(400).json({
        error: "Invalid offset",
        message: "Offset must be a non-negative number",
      });
    }
  }
  next();
}

// Validate subject
export function validateSubject(req, res, next) {
  const { subject } = req.query;
  if (subject) {
    const validSubjects = [
      "Science", "Mathematics", "English", "History",
      "Personal & Social Development", "Life Skills",
      "Computing", "Learning to Learn",
    ];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({
        error: "Invalid subject",
        message: `Subject must be one of: ${validSubjects.join(", ")}`,
      });
    }
  }
  next();
}

// Validate topic type
export function validateTopicType(req, res, next) {
  const { type } = req.query;
  if (type) {
    const validTypes = ["CONCEPTUAL", "PROCEDURAL", "REPRESENTATIONAL", "LANGUAGE", "META"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: "Invalid type",
        message: `Type must be one of: ${validTypes.join(", ")}`,
      });
    }
  }
  next();
}

// Sanitize search query
export function sanitizeSearch(req, res, next) {
  const { q, search } = req.query;
  const query = q || search;
  if (query) {
    // Remove potential XSS characters, limit length
    const sanitized = String(query).replace(/[<>]/g, "").slice(0, 200);
    if (q) req.query.q = sanitized;
    if (search) req.query.search = sanitized;
  }
  next();
}
