function Validator(options) {

    const selectorRules = {};
    function Validate(inputElement, rule) {
        const errorElement = inputElement.parentElement.querySelector('.error');
        var errorMess;
        var rules = selectorRules[rule.selector];
        
        //Lặp từng rule
        for(var i = 0; i < rules.length; i++) {
            errorMess = rules[i](inputElement.value)
            if(errorMess) break;
        }

        if(errorMess) {
            errorElement.innerText = errorMess;
        } else {
            errorElement.innerText = '';
        }

        return !errorMess;
    }
    //Lấy element form 
    const formElement = document.querySelector(options.form);
    if(formElement) {
        //Khi submit
        formElement.onsubmit = function(e) {
            e.preventDefault();
            var isFormValid = true;

            //check toàn bộ rule
            options.rules.forEach(function(rule) {
                const inputElement = formElement.querySelector(rule.selector);
                var isValid = Validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            })

            var enableInputs = formElement.querySelectorAll('input');
            var formValues = Array.from(enableInputs).reduce(function(values, input) {
                    values[input.name] = input.value;
                    return values;
            }, {})

            //Nhập đúng toàn bộ form
            if(isFormValid) {
                if(typeof options.onSubmit === 'function') {   
                    const button =  document.getElementById("button");
                    button.disabled = true;
                    button.innerText = 'Loading...';

                    setTimeout(function() {
                        options.onSubmit(formValues);
                        for (var i = 0; i < enableInputs.length; i++) {
                            enableInputs[i].value = enableInputs[i].defaultValue;
                        }
                        button.innerText = 'SUMIT';
                        button.disabled = false;                        
                    }, 3000)
                }
            } 
        }

        options.rules.forEach(function(rule) {
            //Lưu các rule   
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.checkValue);
            } else {
                selectorRules[rule.selector] = [rule.checkValue];
            }
           
            const inputElement = formElement.querySelector(rule.selector);
            if(inputElement) {                
                inputElement.onblur = function() {
                    Validate(inputElement, rule);
                }
            }
        });
    }
}

Validator.isRequired = function(selector) {
    return {
        selector: selector,
        checkValue: function(value) {
            return value.trim() ? undefined : 'Vui lòng nhập nhập trường này!'
        }
    }
}

Validator.isUsername = function(selector) {
    return {
        selector: selector,
        checkValue: function(value) {
            if (value == '' || value.length < 6 || !/^[a-zA-Z0-9_\.]+$/.exec(value)) {
                return 'Username không hợp lệ!'
            }
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        checkValue: function(value) {
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.exec(value)) {
                return 'Trường này phải là email!'
            }            
        }
    }
}

Validator.isPassword = function(selector) {
    return {
        selector: selector,
        checkValue: function(value) {
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/.exec(value)) {
                return 'Mật khẩu không hợp lệ!'
            }             
        }
    }
}

Validator.isConfirmPass = function(selector, confirmValue) {
    return {
        selector: selector,
        checkValue: function(value) {
            if(value !== confirmValue()) {
                return 'Mật khẩu không khớp!'
            }
        }
    }
}

Validator.isFullname = function(selector) {
    return {
        selector: selector,
        checkValue: function(value) {
            if (!/[\x5F]+|[a-z]/.exec(value)) {
                return 'Vui lòng nhập tên đầy đủ của bạn!'
            }              
        }
    }
}

Validator.isAge = function(selector) {
    return {
        selector: selector,
        checkValue: function(value) {
            if(value < 16 || value > 120) {
                return 'Tuổi không hợp lệ!'
            }
        }
    }
}



