odoo.define('pos_task.pos_client_details', function(require){
    "use strict";
    var gui = require('point_of_sale.gui');
    var popups = require('point_of_sale.popups');
    var pos_screen = require('point_of_sale.screens');
    var PosBaseWidget = require('point_of_sale.BaseWidget');
    var core = require('web.core');``
    var _t = core._t;

    console.log('hiiiii')

    pos_screen.ActionpadWidget.include({
        init: function(parent,option){
            var self = this
            this._super(parent, option);

                this.pos.bind('change:selectedClient', function() {
                self.renderElement();
            });
        },

        renderElement: function() {
            var self = this;
            this._super();
            this.$('.pay').click(function(){
                var order = self.pos.get_order();
                var is_client = self.pos.get_client().names
                console.log('client avail', is_client)
                var has_client_zip = self.pos.get_client().zip
                var has_valid_product_lot = _.every(order.orderlines.models, function(line){
                    return line.has_valid_product_lot();
                });
                if(is_client){
                    console.log('client is herre...')
                }
                if(!has_valid_product_lot && !has_client_zip){
                    self.gui.show_popup('confirm',{
                        'title': _t('Empty Serial/Lot Number'),
                        'body':  _t('One or more product(s) required serial/lot number.'),
                        confirm: function(){
                            if(!has_client_zip){
                                self.gui.show_screen('products')
                                self.gui.show_popup('error',{
                                    'title': _t('Empty Zipcode'),
                                    'body': _t('Zipcode Required')
                                });
                            }
                            else{
                                self.gui.show_screen('payment');
                            }
                        },
                    });
                }
                else if(!has_client_zip){
                    self.gui.show_screen('products')
                    self.gui.show_popup('error',{
                        'title': _t('Empty Zipcode'),
                        'body': _t('Zipcode Required')
                    });
                }
                else{
                    self.gui.show_screen('payment');
                }
            });
            this.$('.set-customer').click(function(){
                self.gui.show_screen('clientlist');
            });
        }
    });

    // pos_screen.ClientListScreenWidget.include({
    //     save_changes: function(){
    //         var self = this
    //         var z = this.new_client.zip
    //         if (z == ''){
    //             console.log('ERRRRRRRRRRRRRRRRRRRRRRRRorrrr')
    //             alert('Enter zipcode')
    //             this.gui.show_sync_error_popup('error',_t('Zipcode is Required'));
    //         //     self.pos.gui.show_popup('error',{
    //         //         title :_t('Modification Resctricted'),
    //         //         body  :_t('Booked Order cannot be modified'),
    //         // });
    //             // return;
    //         }
    //         else{
    //             this._super();
    //         }
    //         console.log('inherited ClientListScreenWidget', z)

    //     },
    // });
});
// console.log('zippppp', has_client_zip)
//                 else if(!has_client_zip){
//                     self.gui.show_popup('error',{
//                         'title': _t('Empty Zipcode'),
//                         'body':  _t('customer must have Zipcode.'),
//                     cancel: function(){
//                             console.log('calling')
//                             self.gui.show_screen('products');
//                         },
//                     });
//                 }
//                 else{
//                     self.gui.show_screen('payment');
//                 }
//             });
