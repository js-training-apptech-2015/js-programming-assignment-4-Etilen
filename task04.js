function ObjectWithMethodOverloading() {

}
ObjectWithMethodOverloading.prototype = {
    functionDefinitions: [],
    overload: function (name, fn, parameters) {
        var definition = {
            fn: fn,
            name: name,
            parametersCount: parameters != undefined ? parameters.length : fn.length,
            parameters: parameters
        };
        this.functionDefinitions.push(definition);
        this[name] = function () {
            return this.callFunction(name, Array.prototype.slice.call(arguments));
        }
    },
    callFunction: function (name, functionArguments) {
        definition = this.getFunctionDefinition(name, functionArguments);
        return definition.fn.apply(this, functionArguments);
    },
    getFunctionDefinition: function (name, functionArguments) {
        for (var i = 0; i < this.functionDefinitions.length; i++) {

            var definition = this.functionDefinitions[i];
            if (definition.name == name && definition.parametersCount == functionArguments.length) {
                if (definition.parameters) {
                    var parametersMatch = true;
                    for (j = 0; j < functionArguments.length; j++) {
                        if (!((typeof functionArguments[j]).toUpperCase() == definition.parameters[j].name.toUpperCase() || functionArguments[j] instanceof definition.parameters[j])) {
                            parametersMatch = false;
                            break;
                        }
                    }
                    if (!parametersMatch) {
                        continue;
                    }
                }
                return definition;
            }
        }
    }
}

var pendingModules = {};

function define(modules, callback) {
    Promise.all(modules.map(loadModule))
        .then(function (modules) {
            var exported = callback.apply(null, modules);
            var moduleName = document.currentScript.dataset.name;
            if (pendingModules[moduleName]) {
                pendingModules[moduleName](exported);
            }
        });
}

function loadModule(name) {
    return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = name;
        s.setAttribute('data-name', name);
        pendingModules[name] = resolve;
        document.body.appendChild(s);
    });
}