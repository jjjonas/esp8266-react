#include <CurtainStateService.h>

CurtainStateService::CurtainStateService(AsyncWebServer* server,
                                     SecurityManager* securityManager,
                                     AsyncMqttClient* mqttClient,
                                     CurtainMqttSettingsService* curtainMqttSettingsService) :
    _httpEndpoint(CurtainState::read,
                  CurtainState::update,
                  this,
                  server,
                  CURTAIN_SETTINGS_ENDPOINT_PATH,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttPubSub(CurtainState::haRead, CurtainState::haUpdate, this, mqttClient),
    _webSocket(CurtainState::read,
               CurtainState::update,
               this,
               server,
               CURTAIN_SETTINGS_SOCKET_PATH,
               securityManager,
               AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttClient(mqttClient),
    _curtainMqttSettingsService(curtainMqttSettingsService) {
  // configure led to be output
  pinMode(LED_PIN, OUTPUT);

  // configure MQTT callback
  _mqttClient->onConnect(std::bind(&CurtainStateService::registerConfig, this));

  // configure update handler for when the curtain settings change
  _curtainMqttSettingsService->addUpdateHandler([&](const String& originId) { registerConfig(); }, false);

  // configure settings service update handler to update LED state
  addUpdateHandler([&](const String& originId) { onConfigUpdated(); }, false);
}

void CurtainStateService::begin() {
  _state.ledOn = DEFAULT_LED_STATE;
  onConfigUpdated();
}

void CurtainStateService::onConfigUpdated() {
  digitalWrite(LED_PIN, _state.ledOn ? LED_ON : LED_OFF);
}

void CurtainStateService::registerConfig() {
  if (!_mqttClient->connected()) {
    return;
  }
  String configTopic;
  String subTopic;
  String pubTopic;

  DynamicJsonDocument doc(256);
  _curtainMqttSettingsService->read([&](CurtainMqttSettings& settings) {
    configTopic = settings.mqttPath + "/config";
    subTopic = settings.mqttPath + "/set";
    pubTopic = settings.mqttPath + "/state";
    doc["~"] = settings.mqttPath;
    doc["name"] = settings.name;
    doc["unique_id"] = settings.uniqueId;
  });
  doc["cmd_t"] = "~/set";
  doc["stat_t"] = "~/state";
  doc["schema"] = "json";
  doc["brightness"] = false;

  String payload;
  serializeJson(doc, payload);
  _mqttClient->publish(configTopic.c_str(), 0, false, payload.c_str());

  _mqttPubSub.configureTopics(pubTopic, subTopic);
}
