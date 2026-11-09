var wms_layers = [];

var format_PetaGayamsari_0 = new ol.format.GeoJSON();
var features_PetaGayamsari_0 = format_PetaGayamsari_0.readFeatures(json_PetaGayamsari_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_PetaGayamsari_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_PetaGayamsari_0.addFeatures(features_PetaGayamsari_0);
var lyr_PetaGayamsari_0 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_PetaGayamsari_0, 
                style: style_PetaGayamsari_0,
                popuplayertitle: 'Keterangan wilayah',
                interactive: true,
    title: 'Peta Gayamsari<br />\
    <span style="display:inline-block;width:11px;height:11px;border:1px solid #232323;background:#1a9850;vertical-align:-1px"></span> 640 - 850<br />\
    <span style="display:inline-block;width:11px;height:11px;border:1px solid #232323;background:#fee08b;vertical-align:-1px"></span> 850 - 1250<br />\
    <span style="display:inline-block;width:11px;height:11px;border:1px solid #232323;background:#d73027;vertical-align:-1px"></span> 1250 - 1420<br />' });

        var lyr_OpenStreetMap_1 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'type':'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });

lyr_PetaGayamsari_0.setZIndex(10);
lyr_PetaGayamsari_0.setVisible(true);lyr_OpenStreetMap_1.setVisible(true);
var layersList = [lyr_PetaGayamsari_0,lyr_OpenStreetMap_1];
lyr_PetaGayamsari_0.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'NAMOBJ': 'NAMOBJ', 'FCODE': 'FCODE', 'REMARK': 'REMARK', 'METADATA': 'METADATA', 'SRS_ID': 'SRS_ID', 'KDBBPS': 'KDBBPS', 'KDCBPS': 'KDCBPS', 'KDCPUM': 'KDCPUM', 'KDEBPS': 'KDEBPS', 'KDEPUM': 'KDEPUM', 'KDPBPS': 'KDPBPS', 'KDPKAB': 'KDPKAB', 'KDPPUM': 'KDPPUM', 'LUASWH': 'LUASWH', 'TIPADM': 'TIPADM', 'WADMKC': 'WADMKC', 'WADMKD': 'Kelurahan', 'WADMKK': 'WADMKK', 'WADMPR': 'WADMPR', 'WIADKC': 'WIADKC', 'WIADKK': 'WIADKK', 'WIADPR': 'WIADPR', 'WIADKD': 'WIADKD', 'UUPP': 'UUPP', 'LUAS': 'LUAS', 'sttg_num': 'Persentase balita stunting', 'miskin_num': 'Jumlah penduduk miskin', 'Data_Kemiskinan_Gayamsari_Jumlah_Penduduk_Miskin': 'Jumlah penduduk miskin'});
lyr_PetaGayamsari_0.set('fieldImages', {'OBJECTID': 'TextEdit', 'NAMOBJ': 'TextEdit', 'FCODE': 'TextEdit', 'REMARK': 'TextEdit', 'METADATA': 'TextEdit', 'SRS_ID': 'TextEdit', 'KDBBPS': 'TextEdit', 'KDCBPS': 'TextEdit', 'KDCPUM': 'TextEdit', 'KDEBPS': 'TextEdit', 'KDEPUM': 'TextEdit', 'KDPBPS': 'TextEdit', 'KDPKAB': 'TextEdit', 'KDPPUM': 'TextEdit', 'LUASWH': 'TextEdit', 'TIPADM': 'TextEdit', 'WADMKC': 'TextEdit', 'WADMKD': 'TextEdit', 'WADMKK': 'TextEdit', 'WADMPR': 'TextEdit', 'WIADKC': 'TextEdit', 'WIADKK': 'TextEdit', 'WIADPR': 'TextEdit', 'WIADKD': 'TextEdit', 'UUPP': 'TextEdit', 'LUAS': 'TextEdit', 'sttg_num': 'Range', 'miskin_num': 'Range', 'Data_Kemiskinan_Gayamsari_Jumlah_Penduduk_Miskin': 'TextEdit', });
lyr_PetaGayamsari_0.set('fieldLabels', {'OBJECTID': 'hidden field', 'NAMOBJ': 'hidden field', 'FCODE': 'hidden field', 'REMARK': 'hidden field', 'METADATA': 'hidden field', 'SRS_ID': 'hidden field', 'KDBBPS': 'hidden field', 'KDCBPS': 'hidden field', 'KDCPUM': 'hidden field', 'KDEBPS': 'hidden field', 'KDEPUM': 'hidden field', 'KDPBPS': 'hidden field', 'KDPKAB': 'hidden field', 'KDPPUM': 'hidden field', 'LUASWH': 'hidden field', 'TIPADM': 'hidden field', 'WADMKC': 'hidden field', 'WADMKD': 'inline label - always visible', 'WADMKK': 'hidden field', 'WADMPR': 'hidden field', 'WIADKC': 'hidden field', 'WIADKK': 'hidden field', 'WIADPR': 'hidden field', 'WIADKD': 'hidden field', 'UUPP': 'hidden field', 'LUAS': 'hidden field', 'sttg_num': 'inline label - always visible', 'miskin_num': 'inline label - always visible', 'Data_Kemiskinan_Gayamsari_Jumlah_Penduduk_Miskin': 'hidden field'});
lyr_PetaGayamsari_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});window.setSymbolMode = function(mode) {
    if (mode === 'stunting') {
        lyr_PetaGayamsari_0.setStyle(style_PetaGayamsari_0_stunting);
    } else {
        lyr_PetaGayamsari_0.setStyle(style_PetaGayamsari_0);
    }
};
