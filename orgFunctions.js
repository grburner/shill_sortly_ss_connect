const orgFunctions = {
  getBinNumber: function(obj) {
    let retVal
    obj.forEach(entry => {
      if (entry.custom_attribute_id === 184670) {
        retVal = entry.value
      }
    })
    return retVal;
  }
}

module.exports = orgFunctions;