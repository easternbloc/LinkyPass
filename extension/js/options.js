(function ($) {
    'use strict';

    function updatePasswordPreview() {
        var pass = 'shKSVShgv379oJHInHYCxAAA';
        if ($('.password-preview .stealth').text().length) {
            pass = 'kTEul36AW0ukhpPZ0fx9GwAA';
        }
        $('.password-preview .generatedPass').text(pass.substr(0, $('#length').val() || 4));
    }

    function addPassword(pass) {
        var boolIcons = {
            'true': '<i class="ic ic-valid"></i>',
            'false': '<i class="ic ic-invalid"></i>'
        };
        $('#saved_passwords tbody').append(
            '<tr>' +
                '<td>' + pass.name + '</td>' +
                '<td>' + boolIcons[Boolean(pass.hash)] + '</td>' +
                '<td>' + boolIcons[Boolean(pass.stealth)] + '</td>' +
                '<td>' + pass.length + '</td>' +
                '<td>' + (pass.always ? 'Always' : (pass.session ? 'Session' : 'No'))  + '</td>' +
                '<td><button class="remove" data-id="' + pass.id + '">Remove</button></td>' +
            '</tr>'
        );
    }

    $(function () {
        $('input[type=range]').on('change', function () {
            var $this = $(this);
            var rangeValue = $this.siblings('.range-value');
            rangeValue.text(this.value);
            rangeValue.css({ left: ((this.clientWidth / this.max) * this.value) + 'px' });
        }).trigger('change');

        $('.btn-group input[type=radio]').on('change', function () {
            var btn = $(this).parents('.btn');
            if (btn) {
                btn.addClass('active').siblings().removeClass('active');
            }
        }).trigger('change');
        updatePasswordPreview();

        $('#stealth').on('keyup', function () {
            $('.password-preview .stealth').text(this.value.length ? 'stealth' : '');
            updatePasswordPreview();
        });

        $('#length').on('change', function () {
            updatePasswordPreview();
        });

        $('#newProfile').on('submit', function (event) {
            event.preventDefault();
            var pass = new Password({
                name: this.name.value,
                password: this.password.value,
                stealth: this.stealth.value,
                length: Number(this.length.value),
                hash: this.hash.checked,
                session: this.session.checked,
                always: this.always.checked,
            });
            pass.save(function () {
                addPassword(pass);
            });
        });

        $('#saved_passwords').on('click', '.remove', function () {
            var $this = $(this);
            chrome.storage.sync.remove($this.data('id'), function () {
                $this.parents('tr').remove();
            });
        });

        Password.retreive(null, function (items) {
            items.forEach(addPassword);
        });

    });
})(Zepto);