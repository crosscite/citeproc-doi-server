/*global CSL: true */

CSL.NameOutput.prototype.checkCommonAuthor = function(requireMatch) {
    if (!requireMatch) {
        return false;
    }
    var common_term = false;
    if (this.variables.length === 2) {
        var variables = this.variables;
        var varnames = variables.slice();
        varnames.sort();
        common_term = varnames.join("");
    }
    if (!common_term) {
        return false;
    }
    var has_term = false;
    if (this.state.locale[this.state.opt.lang].terms[common_term]) {
        has_term = true;
    }
    if (!has_term) {
        this.state.tmp.done_vars.push(this.variables[0]);
        this.state.tmp.done_vars.push(this.variables[1]);
        return false;
    }
    var firstSet = this.Item[this.variables[0]];
    var secondSet = this.Item[this.variables[1]];
    var perfectMatch = this._compareNamesets(firstSet, secondSet);
    if (perfectMatch === true) {
        this.state.tmp.done_vars.push(this.variables[0]);
        this.state.tmp.done_vars.push(this.variables[1]);
    }
    // This may be counter-intuitive.
    // This check controls whether we will fail on the this attempt at rendering
    // and proceed with substitution. If the names match exactly (true), then
    // we do *not* want to abort and continue with substitution.
    return !perfectMatch;
};

CSL.NameOutput.prototype.setCommonTerm = function () {
    var variables = this.variables;
    var varnames = variables.slice();
    varnames.sort();
    this.common_term = varnames.join("");
    // When no varnames are on offer
    if (!this.common_term) {
        return;
    }
    var has_term = false;
    if (this.label && this.label[this.variables[0]]) {
        if (this.label[this.variables[0]].before) {
            has_term = this.state.getTerm(this.common_term, this.label[this.variables[0]].before.strings.form, 0);
        } else if (this.label[this.variables[0]].after) {
            has_term = this.state.getTerm(this.common_term, this.label[this.variables[0]].after.strings.form, 0);
        }
     }

    // When there is no common term
    if (!this.state.locale[this.state.opt.lang].terms[this.common_term]
        || !has_term
        || this.variables.length < 2) {
        this.common_term = false;
        return;
    }
    var freeters_offset = 0;
    for (var i = 0, ilen = this.variables.length - 1; i < ilen; i += 1) {
        var v = this.variables[i];
        var vv = this.variables[i + 1];
        if (this.freeters[v].length || this.freeters[vv].length) {
            if (this.etal_spec[v].freeters !== this.etal_spec[vv].freeters
                || !this._compareNamesets(this.freeters[v], this.freeters[vv])) {
                this.common_term = false;
                return;
            }
            freeters_offset += 1;
        }
        if (this.persons[v].length !== this.persons[vv].length) {
            this.common_term = false;
            return;
        }
        for (var j = 0, jlen = this.persons[v].length; j < jlen; j += 1) {
            if (this.etal_spec[v].persons[j] !== this.etal_spec[vv].persons[j]
                || !this._compareNamesets(this.persons[v][j], this.persons[vv][j])) {
                this.common_term = false;
                return;
            }
        }
    }
};

CSL.NameOutput.prototype._compareNamesets = function (base_nameset, nameset) {
    if (!base_nameset || !nameset || base_nameset.length !== nameset.length) {
        return false;
    }
    for (var i = 0, ilen = nameset.length; i < ilen; i += 1) {
        for (var j = 0, jlen = CSL.NAME_PARTS.length; j < jlen; j += 1) {
            var part = CSL.NAME_PARTS[j];
            if (!base_nameset[i] || base_nameset[i][part] != nameset[i][part]) {
                return false;
            }
        }
    }
    return true;
};
