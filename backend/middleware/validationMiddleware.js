function containsUnsafeKey(value) {
  if (Array.isArray(value)) {
    return value.some(containsUnsafeKey);
  }

  if (value && typeof value === "object") {
    return Object.keys(value).some(function (key) {
      return (
        key.startsWith("$") ||
        key.includes(".") ||
        containsUnsafeKey(value[key])
      );
    });
  }

  return false;
}

function rejectMongoOperators(req, res, next) {
  if (
    containsUnsafeKey(req.body) ||
    containsUnsafeKey(req.query) ||
    containsUnsafeKey(req.params)
  ) {
    return res.status(400).json({
      message: "Invalid request data",
    });
  }

  next();
}

function validEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validObjectId(id) {
  return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}

module.exports = {
  rejectMongoOperators,
  validEmail,
  validObjectId,
};
